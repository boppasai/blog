const express=require("express");
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const ejs=require('ejs');
const cookieparser=require('cookie-parser');
const bodyparser=require('body-parser');
const {requireAuth}=require('../middleware/middlewareadmin');
const router=express.Router();
router.use(cookieparser());

// schemas
const AdminSchema=require('../modules/adminSchema');
const blogSchema=require('../modules/blogSchema');




// -------------------------------mongodb atlas connection
mongoose.connect('mongodb+srv://Rupendrablog:Rupendrablog@blogging.sif46kl.mongodb.net/?retryWrites=true&w=majority',(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to database")
    }
})




// creating jwt token 
const createToken=(id)=>{
    return jwt.sign({id},"rupendra0026",{expiresIn:60*60*24});
}





// ----------------------------------------------------------routes.....
router.get("/", async (req,res)=>{
    const blog=await blogSchema.find();
    res.render('home',{blog:blog});
})
router.get("/admin", requireAuth, async (req,res)=>{
    const data=await blogSchema.find();
    // console.log(data);
    res.render('adminhome',{data:data});
})


// ------------------------------------------------login / logout
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/logout',(req,res)=>{
    res.cookie("jwt","",{maxAge:1});
    res.redirect('/login');
})

router.post('/logincheck',async function(req,res){
    const gmail=req.body.lgmail;
    const check=await AdminSchema.findOne({gmail:gmail});
    if(check!=null){
        const recheck=await bcrypt.compare(req.body.lpass,check.password);
        if(recheck){
            const token= await createToken(recheck._id);
            res.cookie("jwt",token,{httpOnly:true});
            res.redirect('/admin');
        }
        else{
            res.send("wrong pass");
        }
    }
    else{
        res.send("no admin found");
    }

})

// --------------------------------------------------------add blog 
router.get("/addblog",requireAuth,(req,res)=>{
   res.render('addblog');
})
router.post("/addblog",async (req,res)=>{
    var title=req.body.btitle;
    var category=req.body.bcategory;
    var define=req.body.bdefine;
    var description=req.body.bdescription;
    const blogdata=await new blogSchema({
        title:title,
        category:category,
        define:define,
        description:description
    })
    blogdata.save().then((e)=>{
        if(e){
            res.redirect('/admin');
        }
        else{
            res.send("unable to save data");
        }
    })
})


// ------------------------------------------------------add admin
router.get('/addadmin',requireAuth,(req,res)=>{
    res.render('addadmin');
})
router.post('/addadmin', async(req,res)=>{
    var name=req.body.aname;
    var gmail=req.body.agmail;
    var password=req.body.apass;
    var salt=await bcrypt.genSalt();
    var hpassword=await bcrypt.hash(password,salt);
    const adddata=await new AdminSchema({name:name,gmail:gmail,password:hpassword});
    adddata.save().then((e)=>{
        if(e){
            res.redirect('/admin');
        }
        else{
            res.send("unable to add admin");
        }
    })
})



// --------------------------------------------updateblog
router.get('/updateblog/:id',requireAuth,async(req,res)=>{
    const up=await blogSchema.findOne({_id:req.params.id});
    res.render('updateblog',{up:up});
})
router.post('/updateblog/:id',requireAuth,async(req,res)=>{
    const x=req.params.id;
    var m_title=req.body.btitle;
    var m_category=req.body.bcategory;
    var m_define=req.body.bdefine;
    var m_description=req.body.bdescription;
    const m_up=await blogSchema.updateOne({_id:x},{
        $set:{
            title:m_title,
            category:m_category,
            define:m_define,
            description:m_description
        }
    });
    if(m_up){
        res.redirect('/admin');
    }
    else{
        res.send("unable to update the data");
    }
    // console.log(x);
})



// --------------------------------------------------delete blog
router.get('/delete/:id',requireAuth,async(req,res)=>{
    const x=req.params.id;
    const y=await blogSchema.findOneAndDelete({_id:x});
    if(y){
        console.log("deleted")
    }
    else{
        console.log("unable to  delete");
    }
    // res.send("delete blog");
    res.redirect('/admin');
})



// ----------------------------------------------------detail blog
router.get('/detailblog/:id',async(req,res)=>{
    const z=await blogSchema.findOne({_id:req.params.id});
    console.log(z);
    res.render('detail',{data:z});
})
module.exports=router;
