import fetch from "node-fetch";

export default async function handler(req, res) {

try {

if (req.method !== "POST") {
return res.status(200).json({ message: "POST only" });
}

const apiKey = process.env.PI_API_KEY;

if (!apiKey) {
return res.status(500).json({ error: "API KEY missing" });
}

const { paymentId } = req.body || {};

if (!paymentId) {
return res.status(400).json({ error: "paymentId required" });
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
