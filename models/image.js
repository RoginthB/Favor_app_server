// server/models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  israted: {
    type:Boolean,
    required: true,
  },
  rating:{
    type:Number,
    required: true,
  },
   userName:{
    type:String,
    required: true,

  },
  userId:{
    type:String,
    required: true,
  },

});

module.exports = mongoose.model('Image', imageSchema);
