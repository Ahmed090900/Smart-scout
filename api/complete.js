import https from "https";

function request(method, url, headers, body) {
  return new Promise((resolve, reject) => {

    const u = new URL(url);

    const options = {
      method: method,
      hostname: u.hostname,
      path: u.pathname + (u.search || ""),
      headers: headers || {}
    };

    const req = https.request(options, (resApi) => {

      let data = "";

      resApi.on("data", chunk => {
        data += chunk;
      });

      resApi.on("end", () => {
        resolve({
          statusCode: resApi.statusCode,
          body: data
        });
      });

    });

    req.on("error", reject);

    if (body) req.write(body);

    req.end();

  });
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing PI_API_KEY" });
  }

  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({
      error: "paymentId and txid required"
    });
  }

  const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;

  try {

    const payload = JSON.stringify({ txid });

    const r = await request(
      "POST",
      url,
      {
        Authorization:`Key ${apiKey}`,
        "Content-Type":"application/json",
        "Content-Length":Buffer.byteLength(payload)
      },
      payload
    );

    if (r.statusCode < 200 || r.statusCode >= 300) {
      return res.status(r.statusCode).json({
        error:"Complete failed",
        details:r.body
      });
    }

    return res.status(200).json({
      ok:true,
      details:r.body
    });

  } catch(e) {

    return res.status(500).json({
      error:"Complete error",
      details:e.message
    });

  }

      }
