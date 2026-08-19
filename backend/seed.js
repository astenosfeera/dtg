//Šis fails izveido pirmo useri datubāzē.
require('dotenv').config(); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUser = async () => {
    try {
        //Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB succesfully');

        //Check if the user already exists
        const existingUser = await User.findOne({ email: 'admin@test.com' });

        if (existingUser) {
            console.log('User admin@test.com already exists in DB.');
            process.exit(0);
        }

        //Scripting password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        //Create new admin
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@test.com',
            password: hashedPassword
        });

        //Save in DB
        await adminUser.save();
        console.log('User created');

        //Turning off the script
L    } catch (err) {
        console.error('Mistake executing seed: ' , err.message);
        process.exit(1);
    }
};

seedUser();
    