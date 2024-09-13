const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utlis/wrapAsync.js');

const User = require('../models/user.js');
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup" , (req , res) => {
    res.render("user/signup");
})


router.post("/signup" ,wrapAsync (async (req, res) => {
    try {let {email , username , password} = req.body;
    const User1 = new User ({
       email : email,
       username: username,
       
    });

   const registeredUser = await User.register(User1 , password) ;
   console.log(registeredUser);
   req.login(registeredUser , (err)=>{
       if(err){
           next(err);
       }
       req.flash("success" , "Welcome To Wanderlust");
       res.redirect("/home");
       
   })
}
   catch(e){
       req.flash("error" , e.message);
       res.redirect("/signup");
   }
}));

router.get("/login" , (req,res) => {
    res.render("user/login");
})


router.post("/login" , saveRedirectUrl , passport.authenticate('local' ,{failureRedirect : "/login" , failureFlash : true}) ,async (req , res) => {
       req.flash("success" , "Welcome Back to WanderListing");
       let redirectUrl = res.locals.redirectUrl ||"/home"
       
       res.redirect(redirectUrl);
})

router.get("/logout" , (req , res , next) => {
    req.logout((err) => {
        if(err) {
           
            next(err);
        }
        else {
            
            req.flash("success" , "you are logged out");
            res.redirect('/login');
        }
    })
})



module.exports = router;