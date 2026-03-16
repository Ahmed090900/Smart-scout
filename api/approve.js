export default async function handler(req,res){

const apiKey=process.env.PI_API_KEY;

const {paymentId}=req.body;

const r=await fetch("https://api.minepi.com/v2/payments/${paymentId}/approve",{

method:"POST",

headers:{
Authorization:"Key ${apiKey}"
}

});

const data=await r.text();

res.status(200).send(data);

}
