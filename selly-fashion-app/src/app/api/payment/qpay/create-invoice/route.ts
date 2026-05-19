// POST /api/payment/qpay/create-invoice
// body: { orderId: string (UUID), amount: number, description?: string, customerCode?: string }
// Returns: { invoice_id, qr_text, qr_image, qPay_shortUrl, urls }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createInvoice } from '@/lib/qpay'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, description, customerCode } = await request.json()

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'orderId заавал' }, { status: 400 })
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Хүчинтэй amount хэрэгтэй' }, { status: 400 })
    }

    const invoice = await createInvoice({
      orderId,
      amount: Math.round(amount),
      description: description || `Selly Fashion захиалга #${orderId.slice(0, 8)}`,
      customerCode,
    })

    console.log('[QPay create-invoice] OK', {
      orderId,
      invoiceId: invoice.invoice_id,
      amount: Math.round(amount),
      callbackEnv: process.env.QPAY_CALLBACK_URL,
    })

    // Захиалга дээр QPay invoice_id-г хадгална (callback дээр харгалзуулахад хэрэгтэй)
    const { error: updateErr } = await supabase
      .from('orders')
      .update({
        qpay_invoice_id: invoice.invoice_id,
        payment_method: 'qpay',
      })
      .eq('id', orderId)

    if (updateErr) {
      console.error('[QPay create-invoice] orders update алдаа:', updateErr)
    }

    return NextResponse.json({ success: true, invoice })
  } catch (err) {
    console.error('QPay create-invoice error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
