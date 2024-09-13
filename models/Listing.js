
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const review = require('./review.js')


const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,

    },

    description : {
        type : String,
    },
    image : {
        
        type : String,
        default : "https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg",
        set : (v) => v==="" ? "https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg" : v

    },
    price : {
        type : Number,
        required : true
        
    },
    location: { 
      type: String,

    },
    country: String,
    review : [{
        type : Schema.Types.ObjectId,
        ref : "review",
    }]
})


listingSchema.post("findOneAndDelete" ,async (listing) => {
      if(listing){
        
        await review.deleteMany({_id : {$in : listing.review}})
      
        
      }
})

const listingCard = mongoose.model("listingCard" , listingSchema);

module.exports = listingCard;