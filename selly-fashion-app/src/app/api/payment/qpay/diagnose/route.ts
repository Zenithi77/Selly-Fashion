// GET /api/payment/qpay/diagnose?orderId=<uuid>
// QPay полл ажиллаж эсэхийг шалгах диагностик endpoint.
// Browser-оос шууд нээж болно. Production-д нийтэд харагдуулахгүйн тулд
// шаардлагатай бол ENV-ээр түгжих боломжтой.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkPayment } from '@/lib/qpay'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const orderId = url.searchParams.get('orderId')

  const env = {
    QPAY_BASE_URL: process.env.QPAY_BASE_URL || '(default)',
    QPAY_USERNAME: process.env.QPAY_USERNAME ? '✔ set' : '✗ ДУТУУ',
    QPAY_PASSWORD: process.env.QPAY_PASSWORD ? '✔ set' : '✗ ДУТУУ',
    QPAY_INVOICE_CODE: process.env.QPAY_INVOICE_CODE || '✗ ДУТУУ',
    QPAY_CALLBACK_URL: process.env.QPAY_CALLBACK_URL || '✗ ДУТУУ',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✔ set' : '✗ ДУТУУ',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? '✔ set (service role)'
      : '⚠ ДУТУУ — anon key ашиглана, RLS update fail болж магадгүй',
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Сүүлийн callback лог-уудыг авах (qpay_callbacks хүснэгт байгаа бол)
  async function recentCallbacks(filter?: { orderId?: string }) {
    let q = supabase
      .from('qpay_callbacks')
      .select('id, received_at, method, order_id, invoice_id, status, paid, total_paid, error, ip')
      .order('received_at', { ascending: false })
      .limit(20)
    if (filter?.orderId) q = q.eq('order_id', filter.orderId)
    const { data, error } = await q
    if (error) return { error: error.message, hint: 'qpay_callbacks хүснэгт байхгүй бол migrations/add-qpay-callbacks-log.sql ажиллуулна уу' }
    return data
  }

  if (!orderId) {
    return NextResponse.json({
      hint: '?orderId=<uuid> нэмж дуудна уу',
      env,
      recentCallbacks: await recentCallbacks(),
    })
  }

  // 1) Захиалгыг олно
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, total_amount, payment_status, payment_method, qpay_invoice_id, paid_at, paid_amount, status')
    .eq('id', orderId)
    .single()

  if (orderErr || !order) {
    return NextResponse.json({
      step: 'select order',
      ok: false,
      error: orderErr?.message || 'Захиалга олдсонгүй (RLS блоклосон байж магадгүй)',
      env,
    })
  }

  if (!order.qpay_invoice_id) {
    return NextResponse.json({
      step: 'qpay_invoice_id',
      ok: false,
      reason: 'orders.qpay_invoice_id хоосон — create-invoice ажиллаагүй эсвэл update fail болсон',
      order,
      env,
    })
  }

  // 2) QPay руу /payment/check дуудна
  let qpay: unknown
  let qpayErr: string | null = null
  try {
    qpay = await checkPayment(order.qpay_invoice_id)
  } catch (e) {
    qpayErr = e instanceof Error ? e.message : String(e)
  }

  // 3) Туршилтаар update оролдоно (RLS шалгах)
  const { error: updTestErr } = await supabase
    .from('orders')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', order.id)

  return NextResponse.json({
    ok: true,
    order,
    qpayCheck: qpay,
    qpayError: qpayErr,
    rlsUpdateTest: updTestErr ? `✗ FAIL: ${updTestErr.message}` : '✔ OK',
    callbacksForOrder: await recentCallbacks({ orderId }),
    env,
  })
}
