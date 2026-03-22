// /api/complete.js
export default async function handler(req, res) {
    try {
        // 1️⃣ تحقق من نوع الطلب
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { paymentId, txid } = req.body;

        if (!paymentId || !txid) {
            return res.status(400).json({ error: 'Missing paymentId or txid' });
        }

        // 2️⃣ استدعاء Pi API للتحقق النهائي من الدفع
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
            method: "GET",
            headers: {
                Authorization: `Key ${process.env.PI_API_KEY}`
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Error fetching payment from Pi' });
        }

        const data = await response.json();

        // 3️⃣ تحقق من صحة الدفع ومطابقة txid
        if (!data || !data.payment || data.payment.amount !== 1 || data.payment.txid !== txid) {
            return res.status(400).json({ error: "Invalid payment or txid mismatch" });
        }

        // 4️⃣ هنا تفعل الخدمة أو تحدث قاعدة البيانات
        console.log("Payment completed:", paymentId, "TXID:", txid);

        // 5️⃣ أرجع نجاح العملية
        return res.status(200).json({ success: true, payment: data.payment });

    } catch (error) {
        console.error("Complete API error:", error);
        return res.status(500).json({ error: error.message });
    }
}
