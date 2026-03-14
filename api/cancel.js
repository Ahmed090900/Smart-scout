export default async function handler(req,res){

const apiKey = process.env.PI_API_KEY

const {paymentId} = req.body

const response = await fetch(
`https://api.minepi.com/v2/payments/${paymentId}/cancel`,
{
method:"POST",
headers:{
Authorization:`Key ${apiKey}`,
"Content-Type":"application/json"
}
})

const data = await response.json()

res.status(200).json(data)

}
