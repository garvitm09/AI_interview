import {BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import Interview from "./pages/Interview";
import InterviewSession from "./pages/InterviewSession";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboardqna from './pages/Dashboardqna';
import RefreshHandler from './utils/RefreshHandler';
import NavBar from "./components/NavBar";
import SessionQA from "./pages/qna"
import { AuthProvider } from './components/AuthContext';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    const PrivateRoute = ({ element }) => {
      return isAuthenticated ? element : <Navigate to="/login" />
    }

  return (  
    <AuthProvider>

    <div className="App">
      <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path="/session-qna" element={<PrivateRoute element={<SessionQA />} />} />
        <Route path='/dashboardqna' element={<PrivateRoute element={<Dashboardqna />} />} />
        <Route path='/interview' element={<PrivateRoute element={<Interview />} />} />
        <Route path='/session' element={<PrivateRoute element={<InterviewSession />} />} />
      </Routes>
      </BrowserRouter>
    </div>
    </AuthProvider>
  );
}

export default App;


