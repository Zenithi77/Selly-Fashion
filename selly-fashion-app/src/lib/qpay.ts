// QPay v2 REST API client
// Docs: https://developer.qpay.mn/
//
// .env.local:
//   QPAY_BASE_URL=https://merchant.qpay.mn/v2
//   QPAY_USERNAME=...        (QPay-аас өгнө)
//   QPAY_PASSWORD=...        (QPay-аас өгнө)
//   QPAY_INVOICE_CODE=...    (QPay-аас өгнө, жишээ: SELLY_INVOICE)
//   QPAY_CALLBACK_URL=https://sellyfashion.mn/api/payment/qpay/callback
//   QUOTAGUARDSTATIC_URL=... (заавал биш — QPay static IP whitelist шаардвал)

import { ProxyAgent, fetch as undiciFetch, type RequestInit as UndiciRequestInit } from 'undici'

const QPAY_BASE_URL = process.env.QPAY_BASE_URL || 'https://merchant.qpay.mn/v2'

// ──────────────────────────────────────────────
// Proxy: QuotaGuard Static (static egress IP for QPay whitelist)
// ──────────────────────────────────────────────
let cachedProxyAgent: ProxyAgent | null = null
function getProxyAgent(): ProxyAgent | null {
  const proxyUrl = process.env.QUOTAGUARDSTATIC_URL || process.env.HTTPS_PROXY
  if (!proxyUrl) return null
  if (!cachedProxyAgent) {
    cachedProxyAgent = new ProxyAgent(proxyUrl)
  }
  return cachedProxyAgent
}

// Бүх QPay-руу гарах fetch энэ wrapper-аар явна — proxy байвал автомат хэрэглэнэ
async function proxiedFetch(url: string, init: RequestInit = {}) {
  const agent = getProxyAgent()
  const reqInit: UndiciRequestInit = {
    method: init.method,
    headers: init.headers as Record<string, string> | undefined,
    body: init.body as string | undefined,
  }
  if (agent) {
    reqInit.dispatcher = agent
  }
  const res = await undiciFetch(url, reqInit)
  return {
    ok: res.ok,
    status: res.status,
    text: () => res.text(),
    json: () => res.json(),
  }
}

interface QPayToken {
  access_token: string
  refresh_token: string
  expires_in: number          // access_token хүчинтэй хугацаа (сек)
  refresh_expires_in: number  // refresh_token хүчинтэй хугацаа (сек)
  obtained_at: number         // ms timestamp (token авсан мөч)
}

// ──────────────────────────────────────────────
// In-memory token cache (per serverless instance)
// QPay шаардлага: "тухайн хугацаанд НЭГ Л УДАА авна".
// Тиймээс:
//   1) хүчинтэй байгаа access_token-ыг дахин ашиглана
//   2) зэрэгцээ хүсэлтүүд нэг л fetch-ийг хуваалцана (in-flight dedupe)
//   3) access_token хугацаа дууссан ч refresh_token хүчинтэй бол /auth/refresh ашиглана
// ──────────────────────────────────────────────
let cachedToken: QPayToken | null = null
let pendingTokenPromise: Promise<QPayToken> | null = null

function isAccessExpired(t: QPayToken): boolean {
  // 60 секундын safety margin
  return Date.now() >= t.obtained_at + (t.expires_in - 60) * 1000
}

function isRefreshExpired(t: QPayToken): boolean {
  return Date.now() >= t.obtained_at + (t.refresh_expires_in - 60) * 1000
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
  const res = await proxiedFetch(`${QPAY_BASE_URL}/auth/token`, {
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

  const data = await res.json() as {
    access_token: string
    refresh_token: string
    expires_in: number
    refresh_expires_in: number
  }
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    refresh_expires_in: data.refresh_expires_in,
    obtained_at: Date.now(),
  }
}

// POST /auth/refresh  — refresh_token-оор шинэ access_token авна
async function refreshToken(refresh_token: string): Promise<QPayToken> {
  const res = await proxiedFetch(`${QPAY_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refresh_token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    // refresh бүтэхгүй бол шинээр basic auth-аар авна
    return fetchNewToken()
  }

  const data = await res.json() as {
    access_token: string
    refresh_token: string
    expires_in: number
    refresh_expires_in: number
  }
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    refresh_expires_in: data.refresh_expires_in,
    obtained_at: Date.now(),
  }
}

async function getAccessToken(forceRefresh = false): Promise<string> {
  // 1) хүчинтэй token байвал шууд буцаана
  if (!forceRefresh && cachedToken && !isAccessExpired(cachedToken)) {
    return cachedToken.access_token
  }

  // 2) аль хэдийн өөр хүсэлт token авч байгаа бол түүнийг хүлээнэ (concurrent dedupe)
  if (pendingTokenPromise) {
    const t = await pendingTokenPromise
    return t.access_token
  }

  // 3) шинэ fetch эхлүүлнэ
  pendingTokenPromise = (async () => {
    try {
      if (cachedToken && !isRefreshExpired(cachedToken) && !forceRefresh) {
        // access expire болсон ч refresh хүчинтэй — refresh ашиглана
        cachedToken = await refreshToken(cachedToken.refresh_token)
      } else {
        cachedToken = await fetchNewToken()
      }
      return cachedToken
    } finally {
      pendingTokenPromise = null
    }
  })()

  const t = await pendingTokenPromise
  return t.access_token
}

async function qpayFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken()
  const res = await proxiedFetch(`${QPAY_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> || {}),
    },
  })

  // Token expire болсон бол нэг удаа дахин оролдоно (force refresh)
  if (res.status === 401) {
    const retryToken = await getAccessToken(true)
    const retry = await proxiedFetch(`${QPAY_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Authorization': `Bearer ${retryToken}`,
        'Content-Type': 'application/json',
        ...(init.headers as Record<string, string> || {}),
      },
    })
    if (!retry.ok) throw new Error(`QPay ${path} (${retry.status}): ${await retry.text()}`)
    return retry.json() as Promise<T>
  }

  if (!res.ok) {
    throw new Error(`QPay ${path} (${res.status}): ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

// ──────────────────────────────────────────────
// 2. Invoice create: POST /invoice
// ──────────────────────────────────────────────
export interface CreateInvoiceParams {
  /** Манай захиалгын ID (UUID). QPay-руу sender_invoice_no болж очно */
  orderId: string
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

  // QPay callback-руу ?order_id=... query параметр өөрөө нэмж явуулна
  const callback_url = `${callbackBase}?order_id=${encodeURIComponent(params.orderId)}`

  return qpayFetch<CreateInvoiceResponse>('/invoice', {
    method: 'POST',
    body: JSON.stringify({
      invoice_code: invoiceCode,
      sender_invoice_no: params.orderId,
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
