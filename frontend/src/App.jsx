// 3.Šajā lapā definēti ceļi, pagaidām ir tikai Login, bet vēlāk varēs pievienot vēl..
import Login from './pages/Login';  //importē jauno Login lapu 
import './App.css';


function App() {
  return (
    <div className="main-app"> {/* 1) šis ir lai centrētu 2) lai vēlāk pievienotu vēl elementus*/}
      <Login /> {/* Izsauc Login lapu kā tagu*/}
    </div>
  );
}

export default App; // import un export vienmēr strādā pārī