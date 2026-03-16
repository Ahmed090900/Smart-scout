export default async function handler(req,res){

const apiKey=process.env.PI_API_KEY;

const {paymentId,txid}=req.body;

const r=await fetch("https://api.minepi.com/v2/payments/${paymentId}/complete",{

method:"POST",

headers:{
Authorization:"Key ${apiKey}",
"Content-Type":"application/json"
},

body:JSON.stringify({
txid:txid
})

});

const data=await r.text();

res.status(200).send(data);

}
