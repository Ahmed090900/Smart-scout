export default async function handler(req, res) {

  const apiKey = process.env.PI_API_KEY;

  const paymentId = req.query.paymentId;

  if(!paymentId){
    return res.status(400).json({error:"paymentId required"});
  }

  const r = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/cancel`,
    {
      method:"POST",
      headers:{
        Authorization:`Key ${apiKey}`
      }
    }
  );

  const data = await r.text();

  res.status(200).send(data);

}
