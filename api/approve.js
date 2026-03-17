export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body;

  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (err) {
    console.error("Body parse error:", err);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { paymentId } = body || {};

  if (!paymentId) {
    console.error("Missing paymentId:", body);
    return res.status(400).json({ error: "paymentId is required" });
  }

  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    console.error("Missing PI_API_KEY in env");
    return res.status(500).json({ error: "Server not configured" });
  }

  try {

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Pi API error:", response.status, data);
      return res.status(response.status).json(data);
    }

    console.log("Payment approved:", data);

    return res.status(200).json(data);

  } catch (error) {

    console.error("Server error:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });

  }
}
