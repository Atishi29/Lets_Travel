const mongoose = require('mongoose');
 const hotelSchema = new mongoose.Schema({
     hotel_name: {
         type: String,
         required:'Hotel name is mandatory',
         max: 32,
         trim : true
     },
     hotel_description: {
        type: String,
        required:'Hotel description is mandatory',
        trim : true
    },
      image : String,
      star_rating:{
          type:Number,
          required:'Hotel Star rating is mandatory',
          max:5
      },
      country :{
          type: String,
          required : 'Country is mandatory',
          trim:true
      },
      cost_per_night:{
          type:Number,
          required:'Cost per night is mandatory',
      },
      available :{
          type: Boolean,
          required :' Availability is mandatory'
      }
 });
 hotelSchema.index({
     hotel_name: 'text',
     country:'text'
 })

 // export model
 module.exports = mongoose.model('Hotel', hotelSchema);