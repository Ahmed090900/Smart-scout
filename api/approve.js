export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }

  const apiKey = process.env.PI_SERVER_API_KEY;   // ← اسم المتغير مهم

  if (!apiKey) {
    console.error("Missing PI_SERVER_API_KEY");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!piResponse.ok) {
      const errorText = await piResponse.text();
      console.error("Pi approve failed:", piResponse.status, errorText);
      return res.status(piResponse.status).json({ error: errorText });
    }

    const data = await piResponse.json();
    console.log("Pi approved:", data);

    return res.status(200).json({ status: 'approved' });   // مهم: رد بسيط وسريع
  } catch (err) {
    console.error("Approve error:", err);
    return res.status(500).json({ error: err.message });
  }
                                 }
