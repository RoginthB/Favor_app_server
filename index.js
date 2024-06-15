const cors = require('cors');

// server.js
const express = require('express');
const mongoose = require('mongoose');
const imageRoutes = require('./routes/imageRoutes');
const createUser = require('./routes/Createuser')

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTING_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json({limit:'50mb'}));
app.use(cors());
// Routes
app.use('/images', imageRoutes);
app.use('/user',createUser);
// defalut Route
app.get('/',(req,res)=>{
  res.send("working");
})
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT);
