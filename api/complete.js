// api/complete.js
// Vercel Serverless Function for Pi Network Server-Side Payment Completion

module.exports = async (req, res) => {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed - Use POST' });
  }

  // Enable CORS (مهم للـ frontend)
  res.setHeader('Access-Control-Allow-Origin', '*'); // أو حدد domainك لو عايز أمان أكتر
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse JSON body
    let body = {};
    if (req.headers['content-type']?.includes('application/json')) {
      body = req.body;
    } else {
      // لو مش JSON، اقرأ الـ body يدوي
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      body = JSON.parse(data || '{}');
    }

    console.log('Received complete request body:', body); // Debugging في Vercel logs

    const { paymentId, txid } = body;

    if (!paymentId || typeof paymentId !== 'string' || paymentId.trim() === '') {
      console.error('Missing or invalid paymentId');
      return res.status(400).json({ error: 'Missing or invalid paymentId' });
    }

    if (!txid || typeof txid !== 'string' || txid.trim() === '') {
      console.error('Missing or invalid txid');
      return res.status(400).json({ error: 'Missing or invalid txid (transaction ID)' });
    }

    // Pi Server API Key من Environment Variables
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!PI_API_KEY) {
      console.error('PI_API_KEY not set');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    const completeUrl = `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/complete`;

    console.log('Completing payment at:', completeUrl);

    const response = await fetch(completeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid: txid.trim() }), // الـ body المطلوب: { "txid": "..." }
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Pi API complete error:', response.status, responseData);
      return res.status(response.status).json({
        error: 'Pi Network completion failed',
        details: responseData.error || response.statusText,
        piStatus: response.status,
      });
    }

    // نجاح
    console.log('Payment completed successfully:', responseData);
    return res.status(200).json({
      success: true,
      message: 'Payment completed on Pi Servers',
      payment: responseData, // PaymentDTO مع status: "completed" إن شاء الله
    });

  } catch (error) {
    console.error('Complete endpoint error:', error.message, error.stack);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
