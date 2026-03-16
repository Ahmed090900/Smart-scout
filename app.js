Pi.init({
version:"2.0",
sandbox:true
});

let authData=null;

const status=document.getElementById("status");

document.getElementById("loginBtn").onclick=login;

async function login(){

status.innerText="Authenticating...";

try{

authData=await Pi.authenticate(['username','payments'],{

onIncompletePaymentFound: async payment => {

await fetch("/api/complete",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
paymentId:payment.identifier,
txid:payment.transaction?.txid
})
})

}

});

status.innerText="Logged in as "+authData.user.username;

}catch(e){

status.innerText="Login failed";

}

}

document.getElementById("payBtn").onclick=pay;

function pay(){

const paymentData={
amount:1,
memo:"Support Smart Scout",
metadata:{type:"support"}
};

const callbacks={

onReadyForServerApproval: paymentId => {

fetch("/api/approve",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({paymentId})
});

},

onReadyForServerCompletion: (paymentId,txid)=>{

fetch("/api/complete",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
paymentId,
txid
})
});

status.innerText="Payment completed";

},

onCancel: ()=>{

status.innerText="Payment cancelled";

},

onError: err=>{

status.innerText="Error "+err.message;

}

};

Pi.createPayment(paymentData,callbacks);

}
