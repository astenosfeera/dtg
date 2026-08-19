// šis fails atbild par visu, kas saistīts ar autentifikāciju. Un par maršutiem (endpoints).
const express = require('express');
const router = express.Router();//izveido mazu maršrutētāju, mini serveri, kas atbild par sadaļas ceļiem
const bcrypt = require('bcryptjs');//lai dorši salīdzinātu lietotāja ievadīto paroli ar DB esošo šifru
const User = require('../models/User');

// router.post - maršuts gaidīs POST pieprasījumu
//"/login" - konkrētā adrese http://localhost:5000/api/auth/login
router.post('/login', async (req, res) => { 
  console.log("Backend: received login request", req.body); //req.body ir express.json paka (email: ***, password: ***)

  try {
    //{} - iekavās, jo tā ir JS objekta destrukturēšana, lai izvilktu konkrētas atslēgas no objekta. 
    //varētu būt arī const email = req.body.email; un const { email, password } = req.body;
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Backend: User was not found in DB");
      //400, ka lietotājs ievadīja nepareizi kko. 
      return res.status(400).json({ msg: 'Wrong email or password' });
    }

    console.log("Backend: User found, checking the password");
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("Backend: Wrong password");
      return res.status(400).json({ msg: 'Wrong email or password' });
    }

    console.log("Backend: Correct password!");
    return res.json({ msg: 'Login successful' });

  } catch (err) {
    console.error("Backend error", err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;