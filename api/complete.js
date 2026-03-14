// pages/api/complete.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed - use GET' });
  }

  try {
    // ← هنا نقرأ من query string (اللي جاي في الـ URL بعد ?)
    const paymentId    = req.query.paymentId 
                      || req.query.id 
                      || req.query.transactionId 
                      || req.query.ref 
                      || null;

    const status       = req.query.status || req.query.result || 'unknown';
    const orderId      = req.query.order || req.query.orderId || req.query.reference;

    console.log('COMPLETE callback received:', {
      method: req.method,
      query: req.query,
      paymentId,
      status,
      orderId,
    });

    if (!paymentId) {
      return res.status(400).json({ 
        error: 'Missing payment identifier in query parameters',
        receivedQuery: req.query 
      });
    }

    // هنا ضع منطقك الحقيقي:
    // 1. تحقق من حالة الدفع (لو في status أو responseCode)
    // 2. حدث قاعدة البيانات (مثلاً order status → paid)
    // 3. أرسل إيميل تأكيد
    // 4. أي حاجة تانية

    // مثال بسيط:
    if (status === 'success' || status === 'paid' || status === 'APPROVED') {
      // await updateOrderToPaid(orderId, paymentId);
      console.log(`Payment SUCCESS → ${paymentId} for order ${orderId || 'unknown'}`);
    } else {
      console.log(`Payment FAILED or pending → ${paymentId}`);
    }

    // اللي بيحصل غالبًا: redirect لصفحة شكر / نجاح
    // ممكن تضيف query params عشان تعرض رسالة مخصصة
    const redirectUrl = `/thank-you?paymentId=${paymentId}&status=${status}&order=${orderId || ''}`;
    
    return res.redirect(303, redirectUrl);
    // أو لو عايز JSON (نادر في redirect بعد دفع):
    // return res.status(200).json({ success: true, paymentId, status });

  } catch (error) {
    console.error('Complete endpoint error:', error);
    // redirect لصفحة خطأ أحسن من 500 page بيضة
    return res.redirect(303, '/payment-failed?error=server');
    // أو
    // return res.status(500).json({ error: 'Internal server error' });
  }
      }
