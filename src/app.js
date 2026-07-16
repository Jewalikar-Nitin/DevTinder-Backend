const express = require('express');
const app = express();

app.use("/home",(req,res)=>{
    res.send('Home logged in')
});

app.use("/dashboard",(req, res)=>{
        res.send('Loading dashboard')
})


app.listen(3000,()=>{
    console.log('server listening');
})