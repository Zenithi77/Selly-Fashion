// GET/POST /api/payment/qpay/callback?order_number=...&qpay_payment_id=...
// QPay-аас төлбөр төлөгдсөн үед энэ URL-руу дуудна.
// QPay-н IP-ээс ирсэн эсэхийг шалгахаас гадна payment_id-г /payment/check-ээр баталгаажуулна.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkPayment } from '@/lib/qpay'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function handle(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const orderNumber = url.searchParams.get('order_number')
    if (!orderNumber) {
      return NextResponse.json({ error: 'order_number дутуу' }, { status: 400 })
    }

    // Захиалгыг олох (qpay_invoice_id хадгалсан байх ёстой)
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, total, qpay_invoice_id, payment_status')
      .eq('order_number', orderNumber)
      .single()

    if (orderErr || !order) {
      return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 })
    }
    if (!order.qpay_invoice_id) {
      return NextResponse.json({ error: 'qpay_invoice_id дутуу' }, { status: 400 })
    }

    // QPay-руу төлбөрийг баталгаажуулна (callback-ийг бүү итгэ — өөрсдөө check)
    const check = await checkPayment(order.qpay_invoice_id)
    const totalPaid = check.rows
      .filter(r => r.payment_status === 'PAID')
      .reduce((sum, r) => sum + Number(r.payment_amount || 0), 0)

    if (totalPaid >= Number(order.total)) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'Paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      return NextResponse.json({ success: true, paid: true })
    }

    return NextResponse.json({ success: true, paid: false, totalPaid })
  } catch (err) {
    console.error('QPay callback error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 },
    )
  }
}

export const GET = handle
export const POST = handle
