// approve.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: "paymentId required" });

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`
      }
    });

    const data = await response.json();

    if (data?.payment?.amount === 1) {
      return res.status(200).json({ success: true, data: data.payment });
    } else {
      return res.status(400).json({ error: "Invalid payment" });
    }
  } catch (err) {
    console.error("Approve error:", err);
    return res.status(500).json({ error: "Server error" });
  }
        }
