import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractPaymentRef, extractAmount, isAmountMatching, isValidSmsSender } from '@/lib/constants';

// Use service role key for webhook (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limiting: store IP and timestamp
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Filter requests within window
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Log incoming webhook (for debugging)
    console.log('Payment webhook received:', {
      from: body.from,
      hasText: !!body.text,
      timestamp: new Date().toISOString()
    });

    // Validate POSTKEY
    const expectedKey = process.env.PAYMENT_WEBHOOK_KEY;
    if (!expectedKey || body.POSTKEY !== expectedKey) {
      console.error('Invalid POSTKEY');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate sender
    if (!body.from || !isValidSmsSender(body.from)) {
      console.error('Invalid SMS sender:', body.from);
      return NextResponse.json(
        { success: false, error: 'Invalid sender' },
        { status: 400 }
      );
    }

    // Validate SMS text exists
    if (!body.text) {
      console.error('No SMS text provided');
      return NextResponse.json(
        { success: false, error: 'No SMS text' },
        { status: 400 }
      );
    }

    // Extract payment reference
    const paymentRef = extractPaymentRef(body.text);
    if (!paymentRef) {
      console.log('No payment reference found in SMS:', body.text.substring(0, 100));
      return NextResponse.json(
        { success: false, error: 'No payment reference found' },
        { status: 400 }
      );
    }

    // Extract amount
    const amount = extractAmount(body.text);
    if (!amount) {
      console.log('No amount found in SMS');
      return NextResponse.json(
        { success: false, error: 'No amount found' },
        { status: 400 }
      );
    }

    console.log('Extracted payment info:', { paymentRef, amount });

    // Find order by payment reference
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_ref', paymentRef)
      .single();

    if (findError || !order) {
      console.error('Order not found for ref:', paymentRef);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if already paid
    if (order.payment_status === 'Paid') {
      console.log('Order already paid:', paymentRef);
      return NextResponse.json({
        success: true,
        message: 'Order already paid',
        orderId: order.id
      });
    }

    // Compare amounts (5% tolerance)
    const expectedAmount = order.total_amount;
    const amountMatches = isAmountMatching(expectedAmount, amount, 5);

    if (amountMatches) {
      // Amount matches - mark as Paid
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'Paid',
          status: 'Processing',
          paid_amount: amount,
          payment_note: `SMS: ${body.text.substring(0, 200)}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update order' },
          { status: 500 }
        );
      }

      console.log('Payment confirmed for order:', order.id);
      
      // TODO: Send email notification to customer
      // await sendPaymentConfirmationEmail(order);

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed',
        orderId: order.id,
        amountPaid: amount
      });

    } else {
      // Amount doesn't match - mark for manual review
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'PendingReview',
          paid_amount: amount,
          payment_note: `Дүн таарахгүй. Хүлээсэн: ${expectedAmount}, Ирсэн: ${amount}. SMS: ${body.text.substring(0, 200)}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order for review:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update order' },
          { status: 500 }
        );
      }

      console.log('Payment marked for review:', order.id, { expected: expectedAmount, received: amount });

      return NextResponse.json({
        success: true,
        message: 'Payment pending review - amount mismatch',
        orderId: order.id,
        expectedAmount,
        receivedAmount: amount
      });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Payment webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
