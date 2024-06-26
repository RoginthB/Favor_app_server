// server/routes/imageRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const NewUser = require("../models/newuser");
const Image = require("../models/image");
const bcrypt = require("bcrypt");
router.get("/login/:email", async (req, res) => {
  const data = await NewUser.findOne({ email: req.params.email });
  res.send(data);
});

//login API
router.post("/login", async (req, res) => {
  const user = await NewUser.findOne({ email: req.body.email });
  if (user === null) {
    res.status(205).send({ message: "User not found." });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send(user);
    } else {
      res.status(203).send({ message: "Wrong Password" });
    }
  } catch (error) {
    res.status(500).send();
  }
});
// New user Create API
router.post("/newuser", async (req, res) => {
  try {
    const {
      name,
      email,
      dateOfBirth,
      gender,
      followers,
      following,
      post,
      userId,
    } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    const newuser = new NewUser({
      name,
      email,
      password,
      dateOfBirth,
      gender,
      followers,
      following,
      post,
      userId,
    });
    const x = await NewUser.find({ email: newuser.email });
    if (x.length === 0) {
      await newuser.save();
      res.status(200).json({ message: "User is created succusfully." });
    } else {
      res
        .status(400)
        .json({ message: "This email Id already used so you can Login " });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get all images API
router.get("/images", async (req, res) => {
  const data = await NewUser.find({});
  const allImages = [];
  data.map((user) => {
    allImages.push(...user.post);
  });
  res.send(allImages);
});

router.put("/:id/image", async (req, res) => {
  console.log(req.params.id);
  const image = await NewUser.find({"post._id": req.params.id });
  console.log(image);
  await NewUser.findOneAndUpdate(
    { post: { _id: req.params.id } },
    { $set: { "post.rating": {$add: [ 5,  1]}} }
  );
  console.log()
  res.json({ message: " rated successfully." });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// post Image
router.post("/:id/upload", async (req, res) => {
  try {
    //console.log(req.body);
    const {
      title,
      description,
      image,
      israted,
      rating,
      userName,
      userId,
      userUniqId,
    } = req.body;
    const id = req.params.id;
    const user = await NewUser.findById(id);
    const newImage = new Image({
      imagePath: image,
      title,
      description,
      israted,
      rating,
      userName,
      userId,
      userUniqId,
    });

    if (user) {
      const result = await NewUser.updateOne(
        { _id: id },
        { $push: { post: newImage } }
      );
      if (result.modifiedCount > 0) {
        let user = await NewUser.findById(id);
        res.status(200).send(user);
      } else {
        res.status(203).send({ message: " not updated successfully." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// router.post("/post/:id", upload.single("image"), async (req,res)=>{
//   const { title, description, israted, rating, userName, userId } = req.body;
//     const newImage = new Image({
//       imageName: req.file.filename,
//       imagePath: req.file.path,
//       title,
//       description,
//       israted,
//       rating,
//       userName,
//       userId,
//     });
//   const user = await NewUser.findById(req.params.id);

//   if (user) {
//       const result = await NewUser.updateOne(
//         { _id: req.params.id },
//         { $push: { post: newImage } }
//       );
//       if (result.modifiedCount > 0) {
//         res.json({ message: "updated successfully." });
//       } else {
//         res.json({ message: " not updated successfully." });
//       }
//     }

//     res.send(user)
// })

// router.post("/:id/post", async (req, res) => {
//   const imageDetails = req.body;
//   const id = req.params.id;
//   const user = await NewUser.find({ _id: id });
//   if (user) {
//     const result = await NewUser.updateOne(
//       { _id: id },
//       { $push: { post: imageDetails } }
//     );
//     if (result.modifiedCount > 0) {
//       res.json({ message: "updated successfully." });
//     } else {
//       res.json({ message: " not updated successfully." });
//     }
//   }
// });

router.post("/:id/follower", async (req, res) => {
  //const user = await NewUser.find


  const user = await NewUser.findOne({ _id: req.params.id });

  const followingDetails = {
    userName: user.name,
    userUniqId: user._id,
    email:  user.email,
    startDateForFollow:  Date.now(),
  };
  let followerOrNot = false;
  if (user.followers.length !== 0) {
    user.followers.forEach((element) => {
      if (element.email === req.body.email) {
        followerOrNot = true;
      }
    });
  }
  if (followerOrNot) {

    const result = await NewUser.updateOne(
      { _id: req.params.id },
      { $pull: { followers:{"userUniqId": req.body.userUniqId}  } }
    );
    const result2 = await NewUser.updateOne(
      { _id: req.body.userUniqId},
      { $pull: { following: {"userUniqId": followingDetails.userUniqId} } }
    );
    if (result.modifiedCount > 0 && result2.modifiedCount>0) {
      res.status(200).json({ message: "Started Unfollowing." });
      //res.status(200).send(user);
    }
    
  } else {
    const result = await NewUser.updateOne(
      { _id: req.params.id },
      { $push: { followers: req.body } }
    );
    const result2 = await NewUser.updateOne(
      { _id: req.body.userUniqId},
      { $push: { following: followingDetails } }
    );
    if (result.modifiedCount > 0 && result2.modifiedCount>0) {
      res.status(200).json({ message: "Started following." });
      //res.status(200).send(user);
    }
  }
});

router.post("/:id/following", async (req, res) => {
  const user = await NewUser.findOne({ _id: req.params.id });
  const followingOrNot = false;
  if (user.following.length !== 0) {
    user.following.forEach((element) => {
      if (element.email === req.body.email) {
        followingOrNot = true;
      }
    });
  }

  if (followingOrNot) {
    res.status(203).json({ message: "Alerady following. " });



  } else {
    const result = await NewUser.updateOne(
      { _id: req.params.id },
      { $push: { following: req.body } }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Started following." });
    }
  }
});

module.exports = router;
