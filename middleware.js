module.exports.isLoggedIn = (req , res , next) => {
     if(!req.isAuthenticated()){
          console.log("me wo hu jab user authonticate nahi hai wali condition ka ")
          req.session.redirectUrl =  req.originalUrl;
          
    req.flash("error" , "You have to logged in to Do this");
       return res.redirect('/login');
     }
     console.log(
     "me hu jab wo banda login ho gaya hai"
     )
     next();
}


module.exports.saveRedirectUrl = (req , res , next) => {
     if(req.session.redirectUrl){
         res.locals.redirectUrl = req.session.redirectUrl;
     }
     next();
 }