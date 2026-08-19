/*const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});*/
const cors = require('cors'); //added after installing npm install cors in terminal
const express = require('express');
const mongoose = require('mongoose'); 
require('dotenv').config(); 

const app = express();
const port = 5000; 

app.use(cors()); //Added after installing npm install cors in terminal, needs to be before next line
app.use(express.json());
app.use('/api/auth', require('./routes/auth')); //added after crating routes/auth.js

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