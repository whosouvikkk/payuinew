export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { planType, username, utr } = req.body;
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Create the Discord Embed matching your theme
        const embed = {
            title: "💳 New Payment Submitted",
            color: 14231153, // The #d92671 Pink/Purple color
            fields: [
                { name: "Payment Type", value: planType, inline: true },
                { name: "MoonWitch Username", value: username, inline: true },
                { name: "UTR Number", value: utr, inline: false },
                { name: "Time", value: new Date().toISOString().replace('T', ' ').substring(0, 19), inline: false }
            ],
            footer: { text: "MoonWitch Payment System" }
        };

        // Send data to Discord
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (!response.ok) {
            throw new Error('Failed to reach Discord');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
