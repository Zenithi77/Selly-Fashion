// POST /api/payment/qpay/create-invoice
// body: { orderNumber: string, amount: number, description?: string, customerCode?: string }
// Returns: { invoice_id, qr_text, qr_image, qPay_shortUrl, urls }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createInvoice } from '@/lib/qpay'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, amount, description, customerCode } = await request.json()

    if (!orderNumber || typeof orderNumber !== 'string') {
      return NextResponse.json({ error: 'orderNumber заавал' }, { status: 400 })
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Хүчинтэй amount хэрэгтэй' }, { status: 400 })
    }

    const invoice = await createInvoice({
      orderNumber,
      amount: Math.round(amount),
      description: description || `Selly Fashion захиалга #${orderNumber}`,
      customerCode,
    })

    // Захиалга дээр QPay invoice_id-г хадгална (callback дээр харгалзуулахад хэрэгтэй)
    await supabase
      .from('orders')
      .update({
        qpay_invoice_id: invoice.invoice_id,
        payment_method: 'qpay',
      })
      .eq('order_number', orderNumber)

    return NextResponse.json({ success: true, invoice })
  } catch (err) {
    console.error('QPay create-invoice error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
