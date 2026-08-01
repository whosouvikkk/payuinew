import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Removed amount from the destructured body
  const { plan, transactionId, username } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL is missing in environment variables.");
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }

  try {
    const discordPayload = {
      content: "🔔 **New Payment Verification Submitted!**",
      embeds: [
        {
          title: "Payment Details",
          color: 15485081, // Hex #EC4899 (Pinkish to match frontend theme)
          fields: [
            { name: "Plan/Type", value: plan.toUpperCase(), inline: true },
            { name: "MoonWitch Username", value: `**${username}**`, inline: true },
            { name: "Transaction ID / UTR", value: `\`${transactionId}\``, inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (!discordRes.ok) {
      throw new Error('Failed to send to Discord webhook');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
}
