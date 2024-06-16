//const Image = require('./image');
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  // imageName: {
  //   type: String,
  //   required: true,
  // },
  imagePath: {
    type: String,
    required: false,
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
    type: Boolean,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userUniqId: {
    type: ObjectId,
    required: true,
  },
});

const newUserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  dateOfBirth: {
    type: Date,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  followers: [{}],
  following: [{}],
  post: [imageSchema],
  userId: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("newuser", newUserSchema);
