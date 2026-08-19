import { useState } from 'react'; //allows to create state variables (email, password, message)
import '../App.css'; //imports CSS stying

//Components like Login, Navbar should start with a capital letter.
function Login() {
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
      console.log("2. FRONTEND: Make fetch request to http://localhost:5000/api/auth/login");
      
      //fetch is an inbuilt browser function that sends the request via network to another page (backend address):
      //await nodrošina, ka backend serveris saņem ziņu, apstrādā to un atsūta atbildi
      //answer is stored in var response
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', //message type is POST usually for checking passwords etc.
        headers: { 'Content-Type': 'application/json',}, 
        body: JSON.stringify({ email, password }), 
      });
//^shorter - > fetch snet data and waited for response.

//After fetch ends work, server sends back response object. It contains HTTP status:
//200 -> All good
//400/401 -> User's mistake - uncorrect password or e-mail
//500 -> Server mistake - error in backend or DB is not working
      console.log("3. FRONTEND: Received status code from backend:", response.status);

//response that we receive from the server in the beginning is not processed, response.json() opens this package and converts JSON text to JS object (like "login-successful")
//await - also the opening of this package takes times so we ask to await till the data will be opened
//result is stored in variable data
      const data = await response.json(); 
      console.log("4. FRONTEND: Received response from backend:", data);

      if (response.ok) {
        setIsError(false);
        setMessage(data.msg); //put in message "box" the text backend server sent
        alert('LOGIN SUCCESSFUL!'); 
      } else {
        setIsError(true);
        setMessage(data.msg);
        alert('KĻŪDA: ' + data.msg);
      } 
    } catch (err) {
      console.error("FRONTEND ERROR DURING FETCH:", err);
      setIsError(true);
      setMessage('Could not connect to the server');
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