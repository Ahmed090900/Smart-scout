// api/approve.js
// Vercel Serverless Function for Pi Network Server-Side Approval

module.exports = async (req, res) => {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed - Use POST' });
  }

  // Enable CORS (مهم للـ frontend requests)
  res.setHeader('Access-Control-Allow-Origin', '*'); // أو حدد domainك: 'https://smart-scout-ten.vercel.app'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse JSON body
    let body = {};
    if (req.headers['content-type']?.includes('application/json')) {
      body = req.body; // في Vercel، req.body يكون parsed لو JSON
    } else {
      // لو مش JSON، اقرأ الـ body يدوي
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      body = JSON.parse(data || '{}');
    }

    console.log('Received approve request body:', body); // للـ debugging في Vercel logs

    const { paymentId } = body;

    if (!paymentId || typeof paymentId !== 'string' || paymentId.trim() === '') {
      console.error('Missing or invalid paymentId');
      return res.status(400).json({ error: 'Missing or invalid paymentId' });
    }

    // Pi Server API Key - لازم تضيفه في Vercel Environment Variables
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!PI_API_KEY) {
      console.error('PI_API_KEY not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    const approveUrl = `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/approve`;

    console.log('Approving payment at:', approveUrl);

    const response = await fetch(approveUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Body فارغ حسب الـ docs
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Pi API error:', response.status, responseData);
      return res.status(response.status).json({
        error: 'Pi Network approval failed',
        details: responseData.error || response.statusText,
        piStatus: response.status,
      });
    }

    // نجاح
    console.log('Payment approved successfully:', responseData);
    return res.status(200).json({
      success: true,
      message: 'Payment approved on Pi Servers',
      payment: responseData,
    });

  } catch (error) {
    console.error('Approve endpoint error:', error.message, error.stack);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
