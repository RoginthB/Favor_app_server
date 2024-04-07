// server/routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const NewUser = require('../models/newuser');
router.get('/login/:email',async (req,res)=>{
  const data = await NewUser.findOne({email:req.params.email});
  res.send(data);
})
router.post('/newuser', async (req, res) => {
  try {
    const { name,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    gender,
	followers,
	following,post,userId } = req.body;

   const newuser = new NewUser({
   	name,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    gender,
	  followers,
	  following,
	  post,
	  userId
   });
   const x = await NewUser.find({email:newuser.email});
   if (x.length===0){
    await newuser.save();
   }else{
      res.status(400).json({"message":"This email Id already used so you can Login "})
   }
   
   

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

