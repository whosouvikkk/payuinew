module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { planType, username, utr } = req.body;
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error("DISCORD_WEBHOOK_URL environment variable is missing.");
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const timestamp = new Date().toISOString();

        const discordEmbed = {
            title: "💳 New Payment Submitted",
            color: 14231153, // Pink/Purple Hex #D92671
            fields: [
                { name: "Payment Type", value: planType || "Unspecified", inline: true },
                { name: "MoonWitch Username", value: username || "N/A", inline: true },
                { name: "UTR Number", value: utr || "N/A", inline: false },
                { name: "Time", value: timestamp, inline: false },
                { name: "IP Address", value: String(clientIp), inline: true },
                { name: "User Agent", value: String(userAgent), inline: false }
            ],
            footer: {
                text: "MoonWitch Payment System"
            },
            timestamp: timestamp
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [discordEmbed] })
        });

        if (!response.ok) {
            throw new Error(`Discord Webhook API returned status ${response.status}`);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
