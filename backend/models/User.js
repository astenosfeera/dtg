const mongoose = require('mongoose'); //gets mongoose library from 'node_modules' folder

const userSchema = new mongoose.Schema({ //defining structure
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, //e-mail should be unique
        trim: true, //automatically trims empty spaces
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    accessToken: { type: String } //lai mongoose ļautu saglabāt 
});

module.exports = mongoose.model('User', userSchema); //makes DB's model 'User'