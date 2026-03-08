export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const PI_SECRET_KEY = process.env.PI_SECRET_KEY;

  if (!PI_SECRET_KEY) {
    return res.status(500).json({ error: "Missing PI_SECRET_KEY" });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  const PI_API = "https://api.minepi.com/v2";

  try {

    const response = await fetch(`${PI_API}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_SECRET_KEY}`,
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        approved: true,
        data
      });
    } else {
      return res.status(response.status).json({
        error: data
      });
    }

  } catch (error) {

    console.error("Approve payment error:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });

  }
}
