import { useState } from 'react'; //allows to create state variables (email, password, message)
import { useNavigate } from 'react-router-dom'; //priekš useNavigate
import '../App.css'; //imports CSS stying
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

//Components like Login, Navbar should start with a capital letter.
function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate(); //priekš protected routes, augšā

  //In order for React to see the variables there are methods like setEmail etc. 
  //useState inserts a value in variable, .. (need to learn more in future)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //We can delete, but it is added in order to show the user if login was successful:
  const [message, setMessage] = useState('');
   // We can delete but it is added in order to set design green or red:
  const [isError, setIsError] = useState(false);

  //Function that is called when the user press the button "Log-in"
  //function handleSubmit receives an event called 'e'
  //async will be asynchron function..
   const handleSubmit = async (e) => {
    //Prevents the automatic reloading of the page. We need to send the data to the backend. :
    e.preventDefault(); 
    //This was added because I wanted to check where was the error:
    console.log("1. FRONTEND: Button pressed, sneding data:", email, password);

    //If there is a mistake in try, it stops and goes to catch block. It was made because at first had problems connecting to DB.
    try {
      //using axios
      const response = await axios.post('/api/auth/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json'},
          withCredentials: true //ļauj pārlūkam saglabāt res.cookie no backend
        }
      );

      console.log("2. FRONTEND: Received response from backend:", response.data);

      const accessToken = response?.data?.accessToken;

      //Saglabā lietotāju un tā tokenu React globālajā AuthContext atmiņā
      setAuth({ email, accessToken });

      setIsError(false);
      setMessage(response.data?.msg || 'LOGIN SUCCESSFUL!');
      
      navigate('/profile'); //novirza lietotāju uz profilu

      } catch (err) {
      console.error("FRONTEND ERROR DURING LOGIN:", err);
      setIsError(true);
      
      if (!err?.response) {
        setMessage('Serveris nav sasniedzams');
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        setMessage(err.response.data?.msg || 'Nepareizs e-pasts vai parole');
      } else {
        setMessage('Autorizācija neizdevās');
      }
    }
  };

return (
  <div className="login-container">
    <h2>Log In</h2>

{/* when executed the form (submited) it calls handleSubmit function */} 
    <form className="login-form" onSubmit={handleSubmit}> 
      <div className="form-group">
        <label>E-mail:</label>
        <input
        type="email"
        value={email}
        //This line reads typed letters in real-time. onChange - works each time when smth is changed, new letter; e-event; e.target - pašreizējais HTML elements; 
        // e.target.value - teksts ko šobrīd esi ierakstījis šajā laukā
        onChange={(e) => setEmail(e.target.value)} 
        required
        />
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
      </div>

      <button type="submit" className="submit-btn">
        Log-in
      </button>
    </form>

    {/* Alert for successful login or mistake */}
    {message && (
      <p className={ isError ? "error-msg" : "success-msg" }>
      {message}
      </p>
    )}

{/* {Maybe I don't need it yet but it is also made:} */}
    <div className="form-links">
      <a href="#forgot" className="forgot-link">Forgot password?</a>
      <p>
        Don't have a profile? <a href="#register" className= "register-link">Register</a>
      </p>
    </div>
  </div>
);
}

export default Login;