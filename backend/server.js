const cors = require('cors'); //added after installing npm install cors in terminal
const express = require('express');
const mongoose = require('mongoose'); 
const cookieParser = require('cookie-parser'); //priekš JWT tokeniem
require('dotenv').config(); 

const app = express();
const port = 5000; 

app.use(cors({
  origin: true, //atļauj pieprasījumus no jebkura lokālā porta
  credentials: true //atļauj sūtīt un saņemt cookies
})); 

app.use(express.json());
app.use(cookieParser()); //nepieciešams priekš req.cookies

app.use('/api/auth', require('./routes/auth')) //added after creating routes/auth.js

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Sucessfully connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

app.get('/api/test', (req, res) => {
  res.json({ status: "success", message: "Server and DB is ready!" });
});

app.listen(port, () => {
  console.log(`Server successfully started on http://localhost:${port}`);
});