
const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
   	name: {
   		type:String,
   		require:true,
   	},
    email:{
   		type:String,
   		require:true,
   	},
    password: {
   		type:String,
   		require:true,
   	},
    dateOfBirth: {
   		type:Date,
   		require:true,
   	},
    gender: {
   		type:String,
   		require:true,
   	},
   	followers :{
   		type:Number,
   		requrie:true,
   	},
   	following :{
   		type:Number,
   		require:true,
   	},
   	post:{
   		type:Number,
   		require:true,
   	},
   	userId:{
   		type:String,
   		require:true,
   	}
});

module.exports = mongoose.model('newuser', newUserSchema);

