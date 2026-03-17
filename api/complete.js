export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    // السماح فقط بـ POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // قراءة الـ body
    let body = {};
    try {
        body = req.body || {};
    } catch (e) {
        console.error('Error parsing body:', e.message);
        return res.status(400).json({ error: 'Invalid request body' });
    }

    const { paymentId, txid } = body;

    // التحقق من البيانات المطلوبة
    if (!paymentId || !txid) {
        console.log('Missing required fields in body:', { body });
        return res.status(400).json({ 
            error: 'paymentId and txid are required' 
        });
    }

    // جلب الـ API Key من الـ env
    const apiKey = process.env.PI_SERVER_API_KEY || process.env.SERVER_API_KEY;

    if (!apiKey) {
        console.error('PI_SERVER_API_KEY is missing in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txid })
        });

        const data = await piResponse.json();

        if (!piResponse.ok) {
            console.error('Pi complete API failed:', {
                status: piResponse.status,
                response: data
            });
            return res.status(piResponse.status).json(data);
        }

        console.log('Payment completed successfully:', {
            paymentId,
            txid,
            piResponse: data
        });

        // رد بسيط وسريع لـ Pi SDK
        return res.status(200).json({ 
            success: true,
            message: 'Payment completed'
        });

    } catch (error) {
        console.error('Error in complete handler:', {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({ error: 'Internal server error' });
    }
}
