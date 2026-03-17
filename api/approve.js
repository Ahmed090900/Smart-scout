export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId } = req.body;
  const SERVER_API_KEY = process.env.SERVER_API_KEY;

  if (!paymentId || !SERVER_API_KEY) {
    return res.status(400).json({ error: 'Missing paymentId or API key' });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${SERVER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('✅ Approved by server:', data);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ Approve error:', error);
    return res.status(500).json({ error: error.message });
  }
}
