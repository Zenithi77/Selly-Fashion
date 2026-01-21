// Payment system constants and helper functions

// Bank account information
export const BANK_ACCOUNTS = {
  khan: {
    bankName: 'Хаан банк',
    accountNumber: '5021296757',
    accountName: 'Selly Fashion', // Өөрийн нэрээ бичнэ үү
    bankLogo: '🏦'
  }
};

// Shipping cost in MNT (₮)
export const SHIPPING_COST = 5000;
export const FREE_SHIPPING_THRESHOLD = 100000; // 100,000₮-аас дээш үнэгүй хүргэлт

// Payment statuses
export const PAYMENT_STATUSES = ['Pending', 'Paid', 'PendingReview', 'Failed', 'Refunded'] as const;
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

// Order statuses
export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

// Generate unique payment reference
// Format: TK-XXXXX (5 characters alphanumeric)
export function generatePaymentRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TK-'; // Prefix - өөрчилж болно (жишээ: "SF-", "ORD-", "PAY-")
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format price in MNT
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN').format(price) + '₮';
}

// Format price without currency symbol
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('mn-MN').format(num);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}

// Extract payment reference from SMS text
// Supports formats: TK-XXXXX, ORDER-XXXXX, etc.
export function extractPaymentRef(smsText: string): string | null {
  // Match pattern: 2-4 letters + dash + 5 alphanumeric characters
  const patterns = [
    /[A-Z]{2,4}-[A-Z0-9]{5}/i,  // TK-ABC12, ORDER-XYZ99
    /Guilgeenii utga:\s*([A-Z0-9-]+)/i,  // Хаан банк format
    /Гүйлгээний утга:\s*([A-Z0-9-]+)/i,  // Cyrillic format
    /message:\s*([A-Z0-9-]+)/i,  // Alternative format
  ];

  for (const pattern of patterns) {
    const match = smsText.match(pattern);
    if (match) {
      // Return the captured group if exists, otherwise the full match
      return match[1]?.toUpperCase() || match[0].toUpperCase();
    }
  }
  
  return null;
}

// Extract amount from SMS text
// Supports: 6,000.00, 6000, 6 000, etc.
export function extractAmount(smsText: string): number | null {
  const patterns = [
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:dungeer|төгрөг|tugrug|MNT)/i,  // 6,000.00 dungeer
    /(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/,  // General number pattern
  ];

  for (const pattern of patterns) {
    const match = smsText.match(pattern);
    if (match) {
      // Remove commas, spaces, and parse
      const amount = parseFloat(match[1].replace(/[,\s]/g, ''));
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  
  return null;
}

// Check if amount matches within tolerance (default 5%)
export function isAmountMatching(expected: number, actual: number, tolerancePercent: number = 5): boolean {
  const tolerance = expected * (tolerancePercent / 100);
  return Math.abs(expected - actual) <= tolerance;
}

// Validate SMS sender
export const VALID_SMS_SENDERS = [
  'Khaan Bank',
  'Khan Bank', 
  'KHANBANK',
  '132525',  // Хаан банкны SMS дугаар
  'TDB',
  'Golomt',
  'State Bank',
  'XacBank'
];

export function isValidSmsSender(sender: string): boolean {
  return VALID_SMS_SENDERS.some(valid => 
    sender.toLowerCase().includes(valid.toLowerCase())
  );
}
