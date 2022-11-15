const express=require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));
const routeslist=require('./routes/routes');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use('/public',express.static('public'));
app.set('view engine','ejs');
app.use(routeslist);
app.use(cookieParser());


app.listen(4000,()=>{console.log("server running")});