// api/complete.js
// يكمل الدفع بعد ما يتم الـ transaction (Server Completion)

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const apiKey = process.env.PI_API_KEY;
  if (!apiKey) {
    console.error('Missing PI_API_KEY');
    return res.status(500).json({ ok: false, error: 'Missing API key' });
  }

  const { paymentId, txid } = req.body || {};

  if (!paymentId || !txid) {
    console.log('Missing fields - received body:', req.body);
    return res.status(400).json({ ok: false, error: 'paymentId and txid are required' });
  }

  const url = `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/complete`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Pi complete failed:', response.status, data);
      return res.status(response.status).json(data);
    }

    console.log('Payment completed successfully:', { paymentId, txid });
    return res.status(200).json({ ok: true, message: 'Completed' });

  } catch (error) {
    console.error('Complete endpoint error:', error.message);
    return res.status(500).json({ ok: false, error: 'Server error', details: error.message });
  }
};
