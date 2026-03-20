// api/cancel.js
// ملاحظة: Pi SDK لا يطلب عادةً cancel من السيرفر، لكن لو عايز endpoint للإلغاء يدوي

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const apiKey = process.env.PI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'Missing API key' });
  }

  const { paymentId } = req.body || {};

  if (!paymentId) {
    return res.status(400).json({ ok: false, error: 'paymentId is required' });
  }

  // ملاحظة: Pi API لا يوفر endpoint رسمي للـ cancel من السيرفر في v2 حاليًا
  // هنا مجرد مثال – لو فيه طريقة مستقبلية، غير الـ URL
  const url = `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/cancel`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ ok: true, message: 'Cancelled' });

  } catch (error) {
    console.error('Cancel error:', error.message);
    return res.status(500).json({ ok: false, error: 'Cancel failed', details: error.message });
  }
};
