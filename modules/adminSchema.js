const express=require('express');
const mongoose=require('mongoose');
const validator=require('validator');
const AdminSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    gmail:{
        type:String,
        validate:validator.isEmail,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        // minLength:10
        
    }
})
module.exports=mongoose.model('admin',AdminSchema);