// api/complete.js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { paymentId } = req.body || {};
    console.log('Completing payment:', paymentId);

    // الرد الرسمي لإنهاء المعاملة
    return res.status(200).json({ 
      action: "complete", 
      message: "Payment marked as completed" 
    });
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
