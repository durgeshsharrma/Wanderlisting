const express = require('express')
const router = express.Router();
const wrapAsync = require('../utlis/wrapAsync.js');
const ExpressError = require('../utlis/ExpressError');
const { listingSchema } = require("../Schema.js");
const AllListing = require('../models/Listing.js');
const methodOverride =  require("method-override");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
}
//Home page Route
router.get("/" , wrapAsync(async (req , res) => {
    let listing = await AllListing.find({});
    
     res.render("Listing/home.ejs" , {listing} )
}))

//add route ka form render karayega ye
router.get("/new" , isLoggedIn , (req , res) => {
    res.render("Listing/new.ejs");
})


router.post("/" , validateListing , wrapAsync(async (req , res) => {
    
   let newListing = new AllListing(req.body.listing);

   await newListing.save();

   req.flash("success", "New Listing Created Successfully");
   res.redirect("/home");


}))




//show route
router.get("/:id" ,wrapAsync(async ( req , res , next) => {
    let {id} = req.params;
    let Findedlisting = await AllListing.findById(id).populate("review");
    
    res.render("Listing/show" , {listing : Findedlisting});
}))


//yaha pe req ayegi jo edit ka form ayega
router.get("/:id/edit" ,wrapAsync(async (req , res) => {
    let {id} = req.params;
    let Findedlisting = await AllListing.findById(id);
    res.render("Listing/edit" , {listing : Findedlisting});
    
}))  

//update Route
router.put("/:id" , validateListing ,wrapAsync(async (req , res) => {
    let {id} = req.params;
   
    await AllListing.findByIdAndUpdate(id , {...req.body.listing});
    req.flash("success", "Listing updated Successfully");
    res.redirect("/home");
}))


router.delete("/:id" ,wrapAsync(async (req , res) => {
    let {id} = req.params;
    await AllListing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted Successfully");
    res.redirect("/home");
}) )

module.exports = router;