// /api/approve.js
export default async function handler(req, res) {
    try {
        // 1️⃣ تحقق من نوع الطلب
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { paymentId } = req.body;

        if (!paymentId) {
            return res.status(400).json({ error: 'Missing paymentId' });
        }

        // 2️⃣ استدعاء Pi API للتحقق من الدفع
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

        // 3️⃣ تحقق من صحة الدفع
        if (!data || !data.payment || data.payment.amount !== 1) {
            return res.status(400).json({ error: "Invalid payment" });
        }

        // 4️⃣ هنا تقدر تسجل الدفع في DB أو تفعل الخدمة
        console.log("Payment verified for:", paymentId);

        return res.status(200).json({ success: true, payment: data.payment });

    } catch (error) {
        console.error("Approve API error:", error);
        return res.status(500).json({ error: error.message });
    }
}
