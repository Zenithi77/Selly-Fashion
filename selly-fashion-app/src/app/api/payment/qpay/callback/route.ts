// GET/POST /api/payment/qpay/callback?order_id=...&qpay_payment_id=...
// QPay-аас төлбөр төлөгдсөн үед энэ URL-руу дуудна.
// Дуудлага бүрийг qpay_callbacks хүснэгтэд лог болгон хадгална.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkPayment } from '@/lib/qpay'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[QPay callback] ⚠️ SUPABASE_SERVICE_ROLE_KEY дутуу — RLS-ээс orders update fail болох болзошгүй')
}
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CallbackLog = {
  method: string
  order_id: string | null
  raw_order: string | null
  invoice_id: string | null
  query: Record<string, string>
  headers: Record<string, string>
  body: unknown
  body_raw: string | null
  ip: string | null
  user_agent: string | null
  status: string
  paid: boolean | null
  total_paid: number | null
  error: string | null
}

async function persistLog(log: CallbackLog) {
  try {
    const { error } = await supabase.from('qpay_callbacks').insert(log)
    if (error) console.error('[QPay callback] log insert fail:', error.message)
  } catch (e) {
    console.error('[QPay callback] log insert exception:', e)
  }
}

async function handle(request: NextRequest) {
  const url = new URL(request.url)
  const query: Record<string, string> = {}
  url.searchParams.forEach((v, k) => { query[k] = v })

  const headers: Record<string, string> = {}
  request.headers.forEach((v, k) => { headers[k] = v })

  const rawOrder = url.searchParams.get('order_id') || url.searchParams.get('order_number')
  const orderId = rawOrder && UUID_RE.test(rawOrder) ? rawOrder : null

  // POST бол body унших
  let body: unknown = null
  let bodyRaw: string | null = null
  if (request.method === 'POST') {
    try {
      bodyRaw = await request.text()
      if (bodyRaw) {
        try { body = JSON.parse(bodyRaw) } catch { /* not json */ }
      }
    } catch { /* ignore */ }
  }

  const log: CallbackLog = {
    method: request.method,
    order_id: orderId,
    raw_order: !orderId ? rawOrder : null,
    invoice_id: null,
    query,
    headers,
    body,
    body_raw: body ? null : bodyRaw,
    ip: headers['x-forwarded-for']?.split(',')[0]?.trim() || headers['x-real-ip'] || null,
    user_agent: headers['user-agent'] || null,
    status: 'received',
    paid: null,
    total_paid: null,
    error: null,
  }

  console.log('[QPay callback] received', { method: log.method, orderId, query })

  try {
    if (!rawOrder) {
      log.status = 'missing_order_id'
      log.error = 'order_id дутуу'
      await persistLog(log)
      return NextResponse.json({ error: 'order_id дутуу' }, { status: 400 })
    }
    if (!orderId) {
      log.status = 'bad_order_id'
      log.error = `order_id UUID биш: ${rawOrder}`
      await persistLog(log)
      return NextResponse.json({ error: 'order_id буруу формат' }, { status: 400 })
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, total_amount, qpay_invoice_id, payment_status')
      .eq('id', orderId)
      .single()

    if (orderErr || !order) {
      log.status = 'order_not_found'
      log.error = orderErr?.message || 'not found'
      await persistLog(log)
      return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 })
    }
    log.invoice_id = order.qpay_invoice_id || null

    if (!order.qpay_invoice_id) {
      log.status = 'no_invoice_id'
      log.error = 'orders.qpay_invoice_id дутуу'
      await persistLog(log)
      return NextResponse.json({ error: 'qpay_invoice_id дутуу' }, { status: 400 })
    }

    // QPay руу баталгаажуулах (callback-ийг бүү итгэ — өөрсдөө check)
    const check = await checkPayment(order.qpay_invoice_id)
    const totalPaid = check.rows
      .filter(r => r.payment_status === 'PAID')
      .reduce((sum, r) => sum + Number(r.payment_amount || 0), 0)

    log.total_paid = totalPaid

    if (totalPaid >= Number(order.total_amount)) {
      const { error: updErr } = await supabase
        .from('orders')
        .update({
          payment_status: 'Paid',
          paid_at: new Date().toISOString(),
          paid_amount: totalPaid,
          status: 'confirmed',
        })
        .eq('id', order.id)
      if (updErr) {
        log.status = 'rls_fail'
        log.error = updErr.message
        log.paid = false
        await persistLog(log)
        console.error('[QPay callback] orders update алдаа:', updErr)
        return NextResponse.json({ success: false, error: updErr.message }, { status: 500 })
      }

      log.status = 'ok'
      log.paid = true
      await persistLog(log)
      return NextResponse.json({ success: true, paid: true })
    }

    log.status = 'not_paid_yet'
    log.paid = false
    await persistLog(log)
    return NextResponse.json({ success: true, paid: false, totalPaid })
  } catch (err) {
    log.status = 'exception'
    log.error = err instanceof Error ? err.message : String(err)
    await persistLog(log)
    console.error('QPay callback error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 },
    )
  }
}

export const GET = handle
export const POST = handle
