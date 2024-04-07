// server/routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Image = require('../models/image');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
router.get('/',async(req,res)=>{
  const data = await Image.find({});
  res.send(data);
})
const upload = multer({ storage: storage });
// post Image 
router.post('/upload',upload.single('image'), async (req, res) => {
  try {
    const { title, description, israted,rating,userName,userId } = req.body;

    const newImage = new Image({
      imageName: req.file.filename,
      imagePath: req.file.path,
      title,
      description,
      israted,
      rating,
      userName,
      userId
    });

    const savedImage = await newImage.save();
    res.json(savedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
