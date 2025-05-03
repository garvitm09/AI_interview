import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const APIUrl = 'http://localhost:5000';

function Login({ setIsAuthenticated }) {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSuccess = (msg) => toast.success(msg);
  const handleError = (msg) => toast.error(msg);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const response = await fetch(`${APIUrl}/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setIsAuthenticated(true); // 👈 update auth state
        setTimeout(() => navigate('/home'), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Login failed");
      } else {
        handleError(message || "Login failed");
      }
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type='email'
            name='email'
            placeholder='Enter your email...'
            value={loginInfo.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type='password'
            name='password'
            placeholder='Enter your password...'
            value={loginInfo.password}
            onChange={handleChange}
          />
        </div>
        <button type='submit'>Login</button>
        <span>Don't have an account? <Link to="/signup">Signup</Link></span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
