import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// bring in toastify
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SignIn from "./pages/SignIn";
import DashboardNew from "./pages/DashboardNew";
import DashboardArchived from "./pages/DashboardArchived";
import Header from "./components/Header"; 
import PrivateRoute from "./components/authComponent/PrivateRoute";

function App() {
  return (
    <>
    
    <Router>
    <Header/>
      <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/dashboard/newleads" element={<PrivateRoute/>}>
          <Route path="/dashboard/newleads" element={<DashboardNew/>}/>
        </Route>
        <Route path="/dashboard/archived" element={<PrivateRoute/>}>
          <Route path="/dashboard/archived" element={<DashboardArchived/>}/>
        </Route>
      </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
