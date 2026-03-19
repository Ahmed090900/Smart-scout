// pages/api/complete.js

export default async function handler(req, res) {
  // 1. السماح فقط بطلبات POST لضمان الأمان وإرسال البيانات في الـ Body
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 2. استخراج البيانات (تأكدنا من استخدام نفس المسميات في الـ Frontend)
  const { paymentId, txid } = req.body;

  console.log("--- [COMPLETE] Process Started ---");
  console.log("Payment ID:", paymentId);
  console.log("Transaction ID (TXID):", txid);

  // 3. التحقق من وجود البيانات الأساسية
  if (!paymentId || !txid) {
    console.error("❌ Error: Missing paymentId or txid in request body");
    return res.status(400).json({ error: "Missing paymentId or txid" });
  }

  const PI_SERVER_API_KEY = process.env.PI_SERVER_API_KEY;
  const PI_API_BASE = 'https://api.minepi.com/v2';

  if (!PI_SERVER_API_KEY) {
    console.error("❌ Error: PI_SERVER_API_KEY is not set in Environment Variables");
    return res.status(500).json({ error: "Server Configuration Error" });
  }

  try {
    // 4. إبلاغ سيرفرات Pi بإتمام المعاملة (Complete)
    const response = await fetch(`${PI_API_BASE}/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_SERVER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      // إرسال الـ txid في جسم الطلب هو أمر إلزامي لـ Pi API
      body: JSON.stringify({ txid })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Payment Completed Successfully on Pi Servers!");
      
      // هنا يمكنك إضافة كود لتحديث قاعدة بياناتك (مثلاً: تفعيل اشتراك المستخدم)
      // await db.orders.update({ where: { paymentId }, data: { status: 'PAID' } });

      return res.status(200).json({ success: true, data });
    } else {
      // إذا حدث خطأ (مثل 404 أو 400)، سيظهر هنا بوضوح
      console.error(`❌ Pi API Complete Error [${response.status}]:`, data);
      return res.status(response.status).json({
        error: "Failed to complete payment with Pi Network",
        details: data
      });
    }

  } catch (error) {
    console.error("💥 Critical Server Error during Complete:", error.message);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
          }
        
