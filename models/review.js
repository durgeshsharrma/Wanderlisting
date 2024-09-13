const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment : {
        required : true,
        type : String
    },
          rating : {
            type  : Number,
            min : 1,
            max : 5,
          },
          created_at : {
            type : Date,
            default : Date.now()
          }
})


const review = mongoose.model("review" , reviewSchema );

module.exports = review;