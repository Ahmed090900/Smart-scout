export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  try {
    // هنا تضع منطق التحقق (مثلاً تحقق من order في قاعدة بيانات)
    // للتجربة: نفترض كل شيء OK
    console.log(`Approving payment: ${paymentId}`);

    // رد سريع للسماح لـ Pi بمواصلة
    res.status(200).json({ approved: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during approval' });
  }
                          }
