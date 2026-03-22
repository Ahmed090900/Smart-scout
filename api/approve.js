export default async function handler(req, res) {
    const { paymentId } = req.body;

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
        method: "GET",
        headers: {
            Authorization: `Key ${process.env.PI_API_KEY}` // 🔥 هنا المفتاح
        }
    });

    const data = await response.json();

    // تحقق إن الدفع حقيقي
    if (data && data.payment && data.payment.amount === 1) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(400).json({ error: "Invalid payment" });
    }
}
