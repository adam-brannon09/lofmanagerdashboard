import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// bring in toastify
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SignIn from "./pages/SignIn";
import DashboardNew from "./pages/DashboardNew";
import DashboardArchived from "./pages/DashboardArchived";
import DashboardContacted from "./pages/DashboardContacted";
import Header from "./components/nonUserComponents/Header"; 
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
        <Route path="/dashboard/assigned" element={<PrivateRoute/>}>
          <Route path="/dashboard/assigned" element={<DashboardArchived/>}/>
        </Route>
        <Route path="/dashboard/contacted" element={<PrivateRoute/>}>
          <Route path="/dashboard/contacted" element={<DashboardContacted/>}/>
        </Route>
      </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
