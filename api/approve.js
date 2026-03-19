export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // 1. السماح بـ POST و GET لضمان وصول البيانات بأي طريقة
  const paymentId = req.body?.paymentId || req.query?.paymentId;

  if (!paymentId) {
    console.error('❌ Error: paymentId is missing. Received Body:', req.body, 'Received Query:', req.query);
    return res.status(400).json({ error: 'paymentId is required' });
  }

  // 2. التحقق من وجود المفتاح بوضوح
  const apiKey = process.env.PI_SERVER_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: PI_SERVER_API_KEY is not defined in Environment Variables');
    return res.status(500).json({ error: 'Server configuration error (Missing API Key)' });
  }

  try {
    console.log(`🚀 Attempting to approve payment: ${paymentId}`);
    
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // جلب الرد كنص أولاً لتجنب مشاكل الـ JSON parsing لو الرد فارغ
    const responseText = await piRes.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: responseText };
    }

    if (!piRes.ok) {
      // هنا يظهر الـ 404 الشهير
      console.error(`❌ Pi API Error [Status ${piRes.status}]:`, data);
      return res.status(piRes.status).json({
        error: 'Pi API Rejected the request',
        status: piRes.status,
        details: data,
        tip: "If 404, double check if your API Key matches the environment (Sandbox vs Mainnet)"
      });
    }

    console.log('✅ Approved successfully:', data);
    return res.status(200).json({ success: true, data });

  } catch (err) {
    console.error('💥 Critical Fetch Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
