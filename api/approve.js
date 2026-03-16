export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = {};
  try {
    body = req.body;  // لو مفيش body-parser، ممكن يكون undefined
  } catch (e) {
    console.error('Body parse error:', e);
  }

  const { paymentId } = body;

  if (!paymentId) {
    console.log('Missing paymentId in body:', body);  // هيظهر في logs
    return res.status(400).json({ error: 'paymentId is required' });
  }

  const apiKey = process.env.PI_SERVER_API_KEY || process.env.SERVER_API_KEY;

  if (!apiKey) {
    console.error('Missing API KEY in env');
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await piRes.json();

    if (!piRes.ok) {
      console.error('Pi API error:', piRes.status, data);
      return res.status(piRes.status).json(data);
    }

    console.log('Approved successfully:', data);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
