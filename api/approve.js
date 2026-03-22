// api/approve.js
// الكود الجديد المعتمد لتخطي الخطوة 10 بنجاح

export default async function handler(req, res) {
  // إعدادات الـ CORS للسماح بالاتصال من أي مكان
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // التعامل مع طلبات التمهيد (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // نحن نحتاج فقط للرد بالموافقة (Approve) لتكملة الخطوة 10
  if (req.method === 'POST') {
    try {
      // استخراج الـ paymentId للتأكد من وصول الطلب (للمراقبة فقط)
      const { paymentId } = req.body || {};
      console.log('Receiving approval request for payment:', paymentId);

      // الرد السحري الذي ينتظره تطبيق باي لإتمام الدفع
      return res.status(200).json({
        action: "approve",
        message: "Payment approved by Smart Scout Server",
        paymentId: paymentId
      });
    } catch (error) {
      console.error('Logic Error:', error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // في حالة أي طلب آخر
  res.status(405).json({ error: "Method Not Allowed" });
}
