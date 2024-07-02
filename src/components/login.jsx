import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react'
import { auth } from './firebase';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const tasksNav = useNavigate();


  const handleSubmit= async(e) => {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(auth,email,password);
        const user = auth.currentUser;
        console.log(user);
        console.log("User Created");
        /*await toast.success("Login Successful!", {
          position:"bottom-center"
        });*/
        tasksNav("/tasks");
        //alert("User Logged-In Succesfully!")
    } catch(error){
        console.log(error);
        toast.error(error.message, {
            position:"bottom-center"
        });
    }
}

  return (
    <>
      <div className="login template d-flex justify-content-center align-items-center 100-w vh-100 100-vh bg-dark"> 
        <div className='40-w p-5 rounded bg-light'>
          <form onSubmit = {handleSubmit}>
            <div className='align-items-center'>
            <h3>Login</h3><br></br>
            </div>
            <div className='mb-3'>
              <label>Email Address: </label>
              <input
                type="email"
                className='form-control'
                placeholder='Enter email'
                value={email}
                onChange = {(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='mb-3'>
              <label>Password: </label>
              <input
                type="password"
                className='form-control'
                placeholder='Enter password'
                value={password}
                onChange = {(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button className="btn btn-primary" type="submit">Submit</button>
              <p  className='forgot-password text-center'>
                Not a register user? <Link to="/register">Register Now</Link>
              </p>
            </div>
            
          </form>
        </div>
      </div>
    </>
  )
}

export default Login