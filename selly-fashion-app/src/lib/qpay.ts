// QPay v2 REST API client
// Docs: https://developer.qpay.mn/
//
// .env.local:
//   QPAY_BASE_URL=https://merchant.qpay.mn/v2
//   QPAY_USERNAME=...        (QPay-аас өгнө)
//   QPAY_PASSWORD=...        (QPay-аас өгнө)
//   QPAY_INVOICE_CODE=...    (QPay-аас өгнө, жишээ: SELLY_INVOICE)
//   QPAY_CALLBACK_URL=https://sellyfashion.mn/api/payment/qpay/callback

const QPAY_BASE_URL = process.env.QPAY_BASE_URL || 'https://merchant.qpay.mn/v2'

interface QPayToken {
  access_token: string
  refresh_token: string
  expires_in: number  // seconds
  refresh_expires_in: number
  obtained_at: number // ms timestamp
}

// In-memory cache (per serverless instance)
let cachedToken: QPayToken | null = null

function isExpired(t: QPayToken): boolean {
  // 60 second safety margin
  return Date.now() >= t.obtained_at + (t.expires_in - 60) * 1000
}

// ──────────────────────────────────────────────
// 1. Authentication: POST /auth/token (Basic auth)
// ──────────────────────────────────────────────
async function fetchNewToken(): Promise<QPayToken> {
  const username = process.env.QPAY_USERNAME
  const password = process.env.QPAY_PASSWORD
  if (!username || !password) {
    throw new Error('QPAY_USERNAME / QPAY_PASSWORD env-ийг тохируулаагүй байна')
  }

  const basic = Buffer.from(`${username}:${password}`).toString('base64')
  const res = await fetch(`${QPAY_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`QPay auth амжилтгүй (${res.status}): ${text}`)
  }

  const data = await res.json()
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    refresh_expires_in: data.refresh_expires_in,
    obtained_at: Date.now(),
  }
}

async function getAccessToken(): Promise<string> {
  if (!cachedToken || isExpired(cachedToken)) {
    cachedToken = await fetchNewToken()
  }
  return cachedToken.access_token
}

async function qpayFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken()
  const res = await fetch(`${QPAY_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })

  // Token expire болсон бол нэг удаа дахин оролдоно
  if (res.status === 401) {
    cachedToken = null
    const retryToken = await getAccessToken()
    const retry = await fetch(`${QPAY_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Authorization': `Bearer ${retryToken}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    })
    if (!retry.ok) throw new Error(`QPay ${path} (${retry.status}): ${await retry.text()}`)
    return retry.json()
  }

  if (!res.ok) {
    throw new Error(`QPay ${path} (${res.status}): ${await res.text()}`)
  }
  return res.json()
}

// ──────────────────────────────────────────────
// 2. Invoice create: POST /invoice
// ──────────────────────────────────────────────
export interface CreateInvoiceParams {
  /** Манай захиалгын дугаар (unique). QPay-руу sender_invoice_no болж очно */
  orderNumber: string
  /** Захиалагчийн ID/нэр (заавал биш) */
  customerCode?: string
  /** Захиалгын тайлбар */
  description: string
  /** Дүн (₮) */
  amount: number
}

export interface CreateInvoiceResponse {
  invoice_id: string
  qr_text: string          // QR текст (бусад бүх банкны апп уншина)
  qr_image: string         // base64 PNG
  qPay_shortUrl: string    // богино линк
  urls: { name: string; description: string; logo: string; link: string }[] // банкны deeplink-үүд
}

export async function createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResponse> {
  const invoiceCode = process.env.QPAY_INVOICE_CODE
  const callbackBase = process.env.QPAY_CALLBACK_URL
  if (!invoiceCode) throw new Error('QPAY_INVOICE_CODE env дутуу')
  if (!callbackBase) throw new Error('QPAY_CALLBACK_URL env дутуу')

  // QPay callback-руу ?qpay_payment_id=... query параметр өөрөө нэмж явуулна
  const callback_url = `${callbackBase}?order_number=${encodeURIComponent(params.orderNumber)}`

  return qpayFetch<CreateInvoiceResponse>('/invoice', {
    method: 'POST',
    body: JSON.stringify({
      invoice_code: invoiceCode,
      sender_invoice_no: params.orderNumber,
      invoice_receiver_code: params.customerCode || 'terminal',
      invoice_description: params.description,
      amount: params.amount,
      callback_url,
    }),
  })
}

// ──────────────────────────────────────────────
// 3. Invoice check (manual polling): POST /payment/check
// ──────────────────────────────────────────────
export interface PaymentCheckResponse {
  count: number
  paid_amount: number
  rows: Array<{
    payment_id: string
    payment_status: 'NEW' | 'FAILED' | 'PAID' | 'REFUNDED'
    payment_amount: number
    payment_currency: string
    payment_date: string
    object_id: string
  }>
}

export async function checkPayment(invoiceId: string): Promise<PaymentCheckResponse> {
  return qpayFetch<PaymentCheckResponse>('/payment/check', {
    method: 'POST',
    body: JSON.stringify({
      object_type: 'INVOICE',
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    }),
  })
}

// ──────────────────────────────────────────────
// 4. Invoice cancel
// ──────────────────────────────────────────────
export async function cancelInvoice(invoiceId: string): Promise<void> {
  await qpayFetch(`/invoice/${invoiceId}`, { method: 'DELETE' })
}
