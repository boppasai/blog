const express=require('express');
const mongoose=require('mongoose');
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    define:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
})
module.exports=mongoose.model('blogdata',blogSchema);