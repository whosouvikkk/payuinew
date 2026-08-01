import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { plan, amount } = req.body;

  // Simulate a payment processing delay
  setTimeout(() => {
    res.status(200).json({
      success: true,
      message: `Successfully processed ${plan} payment of ${amount}`,
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
    });
  }, 1500);
}
