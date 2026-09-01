// šis fails atbild par visu, kas saistīts ar autentifikāciju. Un par maršutiem (endpoints).
const express = require('express');
const router = express.Router();//izveido mazu maršrutētāju, mini serveri, kas atbild par sadaļas ceļiem
const bcrypt = require('bcryptjs');//lai dorši salīdzinātu lietotāja ievadīto paroli ar DB esošo šifru
const jwt = require('jsonwebtoken');//lai ģenerētu un pārbaudītu JWT
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

    console.log("Backend: Correct password! Generating JWT tokens...");

    //Uzģenerē Access Token un Refresh Token (slepenās atslēgas definētas .env failā)
    const accessToken = jwt.sign(
      {id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET || 'access_secret_key',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key', 
      { expiresIn: '7d' }
    );

    // 2. Saglabājam accessToken datubāzē (atbilstoši prasībām)
    user.accessToken = accessToken;
    await user.save();

    // 3. Ierakstām abus žetonus pārlūka "httpOnly" cookies
    res.cookie('accessToken', accessToken, { 
      httpOnly: true, 
      maxAge: 15 * 60 * 1000 // 15 minūtes
    });

    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dienas
    });

    // 4. Atdodam ziņu un accessToken priekš React (Dave Gray pieeja)
    return res.json({ 
      msg: 'Login successful', 
      accessToken 
    });

  } catch (err) {
    console.error("Backend error", err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// GET maršruts priekš React useRefreshToken hooks (/api/auth/refresh)
router.get('/refresh', async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.status(401).json({ msg: 'No refresh token' });

  const refreshToken = cookies.refreshToken;

  try {
    // Pārbaudām vai Refresh Token nav beidzies
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key');
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: 'User not found' });

    // Uzģenerējam jaunu Access Token
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.ACCESS_TOKEN_SECRET || 'access_secret_key', 
      { expiresIn: '15m' }
    );

    // Atjaunojam žetonu datubāzē un cookie
    user.accessToken = newAccessToken;
    await user.save();

    res.cookie('accessToken', newAccessToken, { 
      httpOnly: true, 
      maxAge: 15 * 60 * 1000 
    });

    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ msg: 'Invalid refresh token' });
  }
});

module.exports = router;
