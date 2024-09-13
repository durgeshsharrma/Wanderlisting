const express = require('express')
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utlis/wrapAsync.js');
const ExpressError = require('../utlis/ExpressError');
const review = require('../models/review.js');
const AllListing = require('../models/Listing.js');
const { reviewSchema } = require("../Schema.js");
const {isLoggedIn} = require('../middleware.js')

const validateReview = (req , res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message);
        throw new ExpressError(400 , errMsg);
    }
    else {
        next();
    }
}

router.post("/",validateReview ,isLoggedIn,wrapAsync(async (req , res) => {
    let {id} = req.params;
    console.log(id);
    let listing = await AllListing.findById(id);
    let newReview =  new review(req.body.review);
     listing.review.push(newReview);
     
   await newReview.save();
   await listing.save();
   req.flash("success", "New Review Added Successfully");
   res.redirect(`/home/${id}`);

   
  


}))

router.delete("/:reviewId" ,wrapAsync(async(req,res) => {
    let {id ,reviewId} = req.params;
    

    await AllListing.findByIdAndUpdate(id , {$pull : {review : reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/home/${id}`);

}) )

module.exports = router