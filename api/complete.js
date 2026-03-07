export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // هنا تسجل الدفع في قاعدة بياناتك، ترسل إيميل، تفتح ميزة مدفوعة، إلخ
    console.log(`Completing payment: ${paymentId} | TxID: ${txid}`);

    // مثال: حفظ في ملف أو DB
    // await db.payments.create({ paymentId, txid, amount: 1, status: 'completed' });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during completion' });
  }
}
