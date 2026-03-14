import fetch from "node-fetch";

export default async function handler(req, res) {

try{

if(req.method !== "POST"){
return res.status(405).json({error:"POST only"})
}

const apiKey = process.env.PI_API_KEY;

const { paymentId } = req.body;

const response = await fetch(
`https://api.minepi.com/v2/payments/${paymentId}/approve`,
{
method:"POST",
headers:{
Authorization:`Key ${apiKey}`,
"Content-Type":"application/json"
}
}
);

const data = await response.json();

res.status(200).json(data);

}catch(e){

res.status(500).json({
error:e.message
});

}

}
