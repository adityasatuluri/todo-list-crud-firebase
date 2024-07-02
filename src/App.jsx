import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import Tasks from "./components/tasks.jsx";
import { ToastContainer } from "react-toastify";
import { auth } from "./components/firebase.jsx";


function App() {

  const [user,setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return(
    <Router>
      <div>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </Router>
)}

export default App;
