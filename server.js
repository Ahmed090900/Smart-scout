const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const API_KEY = "usqgwegrliqtohsifyholnutf1cggxdmgpfyyr31uhfj4noemwfyibkgm2pnwfsy";

app.post("/approve", async (req,res)=>{

try{

const paymentId = req.body.paymentId;

await axios.post(
`https://api.minepi.com/v2/payments/${paymentId}/approve`,
{},
{
headers:{
Authorization:`Key ${API_KEY}`
}
}
);

res.json({success:true});

}catch(err){

console.log(err);
res.json({success:false});

}

});

app.post("/complete", async (req,res)=>{

try{

const paymentId = req.body.paymentId;

await axios.post(
`https://api.minepi.com/v2/payments/${paymentId}/complete`,
{},
{
headers:{
Authorization:`Key ${API_KEY}`
}
}
);

res.json({success:true});

}catch(err){

console.log(err);
res.json({success:false});

}

});

app.listen(3000,()=>{
console.log("Server running on port 3000");
});
