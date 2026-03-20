// api/approve.js
// يوافق على الدفع (Server Approval)

module.exports = async (req, res) => {
  // التعامل مع طلبات OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // يجب أن يكون POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const apiKey = process.env.PI_API_KEY;
  if (!apiKey) {
    console.error('Missing PI_API_KEY in environment variables');
    return res.status(500).json({ ok: false, error: 'Missing API key' });
  }

  const { paymentId } = req.body || {};

  if (!paymentId) {
    console.log('Missing paymentId - body received:', req.body);
    return res.status(400).json({ ok: false, error: 'paymentId is required' });
  }

  const url = `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/approve`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Pi approve failed:', response.status, data);
      return res.status(response.status).json(data);
    }

    console.log('Payment approved successfully:', paymentId);
    return res.status(200).json({ ok: true, message: 'Approved' });

  } catch (error) {
    console.error('Approve endpoint error:', error.message);
    return res.status(500).json({ ok: false, error: 'Server error', details: error.message });
  }
};
