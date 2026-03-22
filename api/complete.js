// api/complete.js
export default async function handler(req, res) {
  const apiKey = process.env.PI_API_KEY;

  if (req.method === 'POST') {
    const { paymentId, txid } = req.body;
    
    try {
      // إبلاغ سيرفر باي بإتمام المعاملة بنجاح
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ txid })
      });

      if (response.ok) {
        return res.status(200).json({ action: "complete", message: "Success" });
      } else {
        const errorData = await response.json();
        return res.status(400).json(errorData);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
