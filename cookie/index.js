const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');


app.use(cookieParser("secretcode"))

app.get("/verify" , (req , res) => {
    
    res.send("verify");
})

app.get("/signedcookie" , (req , res) => {
    res.cookie("hello" , "Durgesh" , {signed : true});
    res.send("signed cookie recieved");
    console.log(req.signedCookies)
    
})

app.listen(3000 , (err) => {
    if(err){
        console.log(err)
    }else{
        console.log("server has started on port 3000");
    }
})