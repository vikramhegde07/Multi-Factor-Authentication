import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import LoginForm from './Components/Login'
import EnableMFA from './Components/EnableMFA'
import DisableMFA from './Components/DisableMFA'
import RegisterForm from './Components/Register'
import Home from './Components/Home';
import Profile from './Components/Profile';


function App() {

  const [isLogged, setIsLogged] = useState(false);

  function checkLogin() {
    const token = localStorage.getItem('userToken') || null;
    if (token !== null)
      setIsLogged(true);
    else
      setIsLogged(false);
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home logged={isLogged} refresh={checkLogin} />} />
        <Route path='/login' element={<LoginForm logged={isLogged} refresh={checkLogin} />} />
        <Route path='/register' element={<RegisterForm logged={isLogged} />} />
        <Route path='/profile' element={<Profile logged={isLogged} refresh={checkLogin} />} />
      </Routes>
    </>
  )
}

export default App
