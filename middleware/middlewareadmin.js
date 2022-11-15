const jwt=require('jsonwebtoken');
const express=require('express');
const app=express();
const cookieParser = require('cookie-parser')
app.use(cookieParser());

const requireAuth=async(req,res,next)=>{
    const token=await req.cookies.jwt;
    // jwt is the name we have give for the cookie
    if(token){
        const x=await jwt.verify(token,"rupendra0026");
        if(x){
            next();
        }
        else{
            res.redirect('/login');
        }
    }
    else{
       res.redirect('/login');
    }
    
}
module.exports={requireAuth};