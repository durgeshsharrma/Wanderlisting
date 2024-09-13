const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");

const user = require('./models/user.js');
const session = require('express-session');
const flash = require('connect-flash');
 const methodOverride =  require("method-override");
 

const passport = require('passport');
const localStrategy = require('passport-local');


const listingsRoute = require('./routes/listing.js');
const reviewsRoute = require('./routes/review.js');
const userRouter = require('./routes/user.js');


//database requirements
const mongoose = require("mongoose");
const Url = "mongodb://127.0.0.1:27017/wanderListing";

//views Setup
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

app.use(express.urlencoded({extended:true}));//params ke url ko encode
app.use(express.static(path.join(__dirname , "/public")));
app.engine("ejs" , ejsMate)
app.use(methodOverride('_method'))

const sessionOptions = {
    secret : "mysupersecretcode",
    resave  :  false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly  : true,
    }
}



app.use(session(sessionOptions))
app.use(flash())


app.use((req , res , next) => {
    res.locals.successMsg = req.flash("success");//req.flash me koi bhi success msg ata hai to wo res.locals me aajaye jo ki bhej dega ejs page directly access hoga
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    
    next();

})


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



main().then(() => {
    console.log("connection successful");
})
.catch((err)=> {
    console.log(err);
})

async function main(){
    mongoose.connect(Url);
}



//Routes

app.use("/home" , listingsRoute) //home se start hone wale route listings me jake match kare
app.use("/home/:id/reviews" , reviewsRoute); //reviews se start hone wale route me jake match ho
app.use("/" , userRouter);






app.use((err , req , res , next) => {
    let{status = 500 , message = "some error occured"} = err;
    res.status(status).render("error.ejs" , {message});
})





app.listen(port , (err) => {
    if(err) {
        console.log(err);

    }
    else{
        console.log(`Server has started on port ${port}`)
    }
})