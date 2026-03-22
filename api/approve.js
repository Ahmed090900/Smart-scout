// api/approve.js
export default async function handler(req, res) {
  const apiKey = process.env.PI_API_KEY; // بيسحب المفتاح من إعدادات فيرسيل السرية

  if (req.method === 'POST') {
    const { paymentId } = req.body;
    
    // نرسل الموافقة لسيرفر باي الرسمي باستخدام المفتاح الخاص بك
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return res.status(200).json({ action: "approve" });
    } else {
      return res.status(400).json({ error: "Failed to approve" });
    }
  }
}
