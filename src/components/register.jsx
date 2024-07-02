import { createUserWithEmailAndPassword } from 'firebase/auth'
import React from 'react'
import { useState } from 'react'
import { auth, db } from './firebase'
import { setDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister= async(e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth,email,password);
            const user = auth.currentUser;
            console.log(user);
            if(user) {
                await setDoc(doc(db,"Users",user.uid), {
                    email:user.email,
                    name:name,
                    tasks:[]
                });
            }
            console.log("User Created");
            toast.success("User Registered Succesfully!", {
              position:"bottom-center"
            });
            window.location.href = "/login";
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
            <form onSubmit={handleRegister}>
              <div className='align-items-center'>
                <h3>Register</h3><br></br>
              </div>

              <div className='mb-3'>
                <label>Name: </label>
                <input
                  type="text"
                  className='form-control'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
  
              <div className='mb-3'>
                <label>Email Address: </label>
                <input
                  type="email"
                  className='form-control'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
  
              <div className='mb-3'>
                <label>Password: </label>
                <input
                  type="password"
                  className='form-control'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
  
              <div className="d-grid">
                <button className="btn btn-primary" type="submit">Submit</button>
                <p className='forgot-password text-center'>
                  Already Registered? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </>
    )
}

export default Register
