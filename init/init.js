const Listing = require('../models/Listing.js') ;
const mongoose = require("mongoose");
const ListingData = require("./data.js");

const Url = "mongodb://127.0.0.1:27017/wanderListing";




main().then(() => {
    console.log("connection successful");
})
.catch((err)=> {
    console.log(err);
})

async function main(){
    mongoose.connect(Url);
}



initDb()



async function initDb(){
    await Listing.deleteMany({});
    await Listing.insertMany(ListingData.data);
    console.log("successfully data inserted");
}