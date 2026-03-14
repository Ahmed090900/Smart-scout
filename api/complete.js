import fetch from "node-fetch";

export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(200).send("POST only");
}

try {

const apiKey = process.env.PI_API_KEY;

const body = req.body || {};
const paymentId = body.paymentId;

if (!paymentId) {
return res.status(400).json({ error: "paymentId missing" });
}

const response = await fetch(
`https://api.minepi.com/v2/payments/${paymentId}/complete`,
{
method: "POST",
headers: {
Authorization: `Key ${apiKey}`,
"Content-Type": "application/json"
}
}
);

const data = await response.json();

return res.status(200).json(data);

} catch (error) {

return res.status(500).json({
error: error.message
});

}

}
