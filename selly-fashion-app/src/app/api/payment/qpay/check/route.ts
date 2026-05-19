// POST /api/payment/qpay/check
// body: { orderId: string (UUID) }
// Frontend-ээс polling хийхэд (захиалагч QR code-аа уншуулан төлсний дараа)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkPayment } from '@/lib/qpay'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    if (!orderId) {
      return NextResponse.json({ error: 'orderId дутуу' }, { status: 400 })
    }

    const { data: order } = await supabase
      .from('orders')
      .select('id, total_amount, qpay_invoice_id, payment_status')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 })
    }

    if (order.payment_status === 'Paid') {
      return NextResponse.json({ paid: true })
    }
    if (!order.qpay_invoice_id) {
      return NextResponse.json({ paid: false, reason: 'invoice үүсгээгүй' })
    }

    let check
    try {
      check = await checkPayment(order.qpay_invoice_id)
    } catch (e) {
      console.error('[QPay check] /payment/check алдаа:', e)
      return NextResponse.json({
        paid: false,
        error: e instanceof Error ? e.message : 'check failed',
        invoiceId: order.qpay_invoice_id,
      })
    }

    const totalPaid = check.rows
      .filter(r => r.payment_status === 'PAID')
      .reduce((sum, r) => sum + Number(r.payment_amount || 0), 0)

    console.log('[QPay check]', {
      orderId,
      invoiceId: order.qpay_invoice_id,
      expected: Number(order.total_amount),
      totalPaid,
      rows: check.rows.length,
      statuses: check.rows.map(r => r.payment_status),
    })

    if (totalPaid >= Number(order.total_amount)) {
      await supabase
        .from('orders')
        .update({ payment_status: 'Paid', paid_at: new Date().toISOString() })
        .eq('id', order.id)
      return NextResponse.json({ paid: true, totalPaid })
    }

    return NextResponse.json({
      paid: false,
      totalPaid,
      expected: Number(order.total_amount),
      rows: check.rows.length,
    })
  } catch (err) {
    console.error('QPay check error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 },
    )
  }
}
