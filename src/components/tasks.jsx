import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import TDLOGO from '../../public/TUDOO_LOGO.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

function Tasks() {
  const [taskTitle, setTaskTitle] = useState("");
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [enableEdit, setEnableEdit] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskDate, setEditTaskDate] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [updatedTrigger, setUpdatedTrigger] = useState(0);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails({ ...docSnap.data(), uid: user.uid });
          console.log("Hello", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("Not logged in");
      }
    });
  };

  const insertTask = async () => {
    if (userDetails) {
      const userDocRef = doc(db, "Users", userDetails.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const tasks = userData.tasks || [];

        const newTask = {
          task_id: tasks.length + 1,
          title: taskTitle,
          datecreated: new Date().toLocaleString(),
          lastedited: null
        };

        await updateDoc(userDocRef, {
          tasks: arrayUnion(newTask)
        });

        console.log(`Task added with id: ${tasks.length}`);

        const updatedDocSnap = await getDoc(userDocRef);
        setUserDetails(updatedDocSnap.data());
        setUpdatedTrigger(updatedTrigger => updatedTrigger + 1);
        console.log(updatedTrigger);
        setTaskTitle('');
      } else {
        console.log("No such document!");
      }
    }
  };

  const deleteTask = async (taskId) => {
    if (userDetails) {
      const userDocRef = doc(db, "Users", userDetails.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const tasks = userData.tasks || [];

        const updatedTasks = tasks.filter(task => task.task_id !== taskId);

        await updateDoc(userDocRef, {
          tasks: updatedTasks
        });

        console.log(`Task with id: ${taskId} removed`);

        const updatedDocSnap = await getDoc(userDocRef);
        setUserDetails(updatedDocSnap.data());
        setUpdatedTrigger(updatedTrigger => updatedTrigger - 1);
        console.log(updatedTrigger);

        updateTaskIndexes(updatedTasks);
      } else {
        console.log("No such document!");
      }
    }
  };

  const updateTaskIndexes = async (tasks) => {
    if (userDetails) {
      const userDocRef = doc(db, "Users", userDetails.uid);

      const updatedTasks = tasks.map((task, index) => ({
        ...task,
        task_id: index
      }));

      await updateDoc(userDocRef, {
        tasks: updatedTasks
      });

      console.log('Task indexes updated');

      const updatedDocSnap = await getDoc(userDocRef);
      setUserDetails(updatedDocSnap.data());
      setUpdatedTrigger(updatedTrigger => updatedTrigger - 1);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [updatedTrigger]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("Logged Out");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditClick = (taskId, taskTitle , taskEdited) => {
    setEnableEdit(true);
    setEditTaskId(taskId);
    setEditTaskTitle(taskTitle);
    setEditTaskDate(taskEdited)
  };

  const handleEditTask = async () => {
    if (userDetails && editTaskId !== null) {
      const userDocRef = doc(db, "Users", userDetails.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedTasks = userData.tasks.map(task =>
          task.task_id === editTaskId ? { ...task, title: editTaskTitle , lastedited:editTaskDate} : task
        );

        await updateDoc(userDocRef, {
          tasks: updatedTasks
        });

        setEnableEdit(false);
        setEditTaskId(null);
        setEditTaskTitle('');
        setEditTaskDate(null);
        setUpdatedTrigger(updatedTrigger + 1);
      }
    }
  };

  return (
    <div className="bg-dark text-light vh-100">
      {userDetails ? (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand d-flex align-items-center" href="#">
                <img src={TDLOGO} height="25" alt="TUDOO" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className="d-flex ms-auto align-items-center">
                  <h5 className="mb-0 me-3" style={{ color: 'black' }}>
                    Welcome <span style={{ color: '#0E6CF7' }}>{userDetails.name}</span>
                  </h5>
                  <button className="btn btn-outline-dark">
                    <Link to="/login" style={{ color: '#0E6CF7' }}>Logout</Link>
                  </button>
                </div>
              </div>
            </div>
          </nav>
  
          <div className='container mt-5' style={{ maxWidth: '600px' }}>
            <div className='mb-5'>
              <div className='d-flex w-100'>
                <input
                  type="text"
                  className='form-control form-control-lg me-2 bg-dark text-light border-light'
                  placeholder='Enter task'
                  value={taskTitle}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      insertTask();
                    }
                  }}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <button className='btn btn-primary' onClick={insertTask}>Create</button>
              </div>
            </div>
  
            {enableEdit && (
              <div className='container mt-5' style={{ maxWidth: '600px' }}>
                <div className='mb-5'>
                  <div className='d-flex w-100'>
                    <input
                      type="text"
                      className='form-control form-control-lg me-2 bg-dark text-light border-light'
                      placeholder='Edit task'
                      value={editTaskTitle}
                      onChange={(e) => setEditTaskTitle(e.target.value)}
                    />
                    <button className='btn btn-primary' onClick={handleEditTask}>Save</button>
                    <button className='btn btn-secondary ms-2' onClick={() => setEnableEdit(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
  
            <div className='w-100'>
              <div className="list-group">
                {userDetails && userDetails.tasks && userDetails.tasks.length > 0 ? (
                  userDetails.tasks.map((task, index) => (
                    <div className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light border-light flex-wrap" key={index}>
                      <span className="w-75" style={{ marginTop: '16px', marginBottom: '16px' }}>
                        {task.title}
                        <br />
                        <p style={{ marginTop: '4px', marginBottom: '0px', fontSize: '12px', color: 'grey' }}>Created: {task.datecreated}</p>
                        {task.lastedited && (
                          <p style={{ marginTop: '2px', marginBottom: '0px', fontSize: '12px', color: 'grey' }}>Last Edited: {task.lastedited}</p>
                        )}
                      </span>
                      <div className="btn-group">
                        <button className='btn btn-outline-light' onClick={() => handleEditClick(task.task_id, task.title, new Date().toLocaleString())}>✏️</button>
                        <button className='btn btn-outline-light' onClick={() => deleteTask(task.task_id)}>❌</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <h5 style={{ color: 'grey' }}>Entered tasks show up here...</h5>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          Loading...
        </div>
      )}
    </div>
  );
  
}

export default Tasks;
