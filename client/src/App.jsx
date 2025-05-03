import {BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import InterviewSession from "../components/InterviewSession";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import RefreshHandler from './RefreshHandler';
import NavBar from "./components/NavBar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <NavBar />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


