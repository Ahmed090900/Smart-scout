export default async function handler(req, res) {

try {

console.log("BODY:", req.body)

if(req.method !== "POST"){
return res.status(405).json({message:"POST only"})
}

const apiKey = process.env.PI_API_KEY

if(!apiKey){
return res.status(500).json({error:"API KEY NOT FOUND"})
}

const { paymentId } = req.body || {}

if(!paymentId){
return res.status(400).json({error:"paymentId missing"})
}

const response = await fetch(
`https://api.minepi.com/v2/payments/${paymentId}/approve`,
{
method:"POST",
headers:{
Authorization:`Key ${apiKey}`,
"Content-Type":"application/json"
}
}
)

const data = await response.json()

return res.status(200).json(data)

}catch(error){

console.error("SERVER ERROR:",error)

return res.status(500).json({
error:error.message,
stack:error.stack
})

}

}
