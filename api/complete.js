// complete.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) return res.status(400).json({ error: "paymentId & txid required" });

    // هنا ممكن تعمل أي منطق إضافي بعد إتمام الدفع
    // مثال: تحديث قاعدة بيانات أو تفعيل المستخدم

    return res.status(200).json({ success: true, paymentId, txid });
  } catch (err) {
    console.error("Complete error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
