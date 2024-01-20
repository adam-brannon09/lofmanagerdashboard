import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// bring in toastify
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header"; 
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
    
    <Router>
    <Header/>
      <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/dashboard" element={<Dashboard/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
