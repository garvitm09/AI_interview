import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIUrl } from '../utils/utils';
import '../css/Login.css';
import { useAuth } from '../components/AuthContext';
import { googleSignIn } from '../firebase';


function Login() {
  const { setIsAuthenticated, setUserInfo } = useAuth();
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
      const { success, message, jwtToken, name, email, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('userEmail', email);

        setIsAuthenticated(true);
        setUserInfo({ name, email });
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
  
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;
      const name = user.displayName;
      const email = user.email;
      const uid = user.uid;
      const token = await user.getIdToken(); // Firebase token
      console.log(token)
      console.log("Google User:", { name, email, uid, token });
      // Send token to your backend for verification
      const response = await fetch(`${APIUrl}/auth/google`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log(data.name)

      if (data.success) {
        handleSuccess("Logged in with Google");
        localStorage.setItem('token', data.jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('userEmail', data.email);

        setIsAuthenticated(true);
        setUserInfo({ name: name, email: data.email });
        setTimeout(() => navigate('/home'), 1000);
      } else {
        handleError("Google login failed");
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  return (
    <div className="LoginContainer">
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="login-btn">
            <button type="submit">Login</button>
          </div>
        </form>

        {/* Google Sign In button */}
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleGoogleLogin} style={{ background: "#4285F4", color: "#fff", padding: "10px", border: "none", borderRadius: "5px" }}>
            Sign in with Google
          </button>
        </div>

        <span className="signup-link">
          Don't have an account? <Link to="/signup">Signup</Link>
        </span>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;






// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer,  toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { APIUrl, handleError, handleSuccess } from '../utils/utils';
// import '../css/Login.css'
// import { useAuth } from '../components/AuthContext';

// function Login() {
//   const { setIsAuthenticated, setUserInfo } = useAuth();
//   const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginInfo(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSuccess = (msg) => toast.success(msg);
//   const handleError = (msg) => toast.error(msg);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { email, password } = loginInfo;
//     if (!email || !password) {
//       return handleError('Email and password are required');
//     }

//     try {
//       const response = await fetch(`${APIUrl}/auth/login`, {
//         method: "POST",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(loginInfo)
//       });

//       const result = await response.json();
//       const { success, message, jwtToken, name, email,  error } = result;

//       if (success) {
//         handleSuccess(message);
//         localStorage.setItem('token', jwtToken);
//         localStorage.setItem('loggedInUser', name);
//         localStorage.setItem('userEmail', email);

//         setIsAuthenticated(true);
//         setUserInfo({ name, email });
//         setTimeout(() => navigate('/home'), 1000);
//       } else if (error) {
//         handleError(error?.details?.[0]?.message || "Login failed");
//       } else {
//         handleError(message || "Login failed");
//       }
//     } catch (err) {
//       handleError(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="LoginContainer">
//   <div className="container">
//     <h1>Login</h1>
//     <form onSubmit={handleLogin}>
//       <div>
//         <label htmlFor="email">Email</label>
//         <input
//           id="email"
//           type="email"
//           name="email"
//           placeholder="Enter your email..."
//           value={loginInfo.email}
//           onChange={handleChange}
//           required
//           autoComplete="username"
//         />
//       </div>
//       <div>
//         <label htmlFor="password">Password</label>
//         <input
//           id="password"
//           type="password"
//           name="password"
//           placeholder="Enter your password..."
//           value={loginInfo.password}
//           onChange={handleChange}
//           required
//           autoComplete="current-password"
//         />
//       </div>
//       <div className="login-btn">
//         <button type="submit">Login</button>
//       </div>
//       <span className="signup-link">
//         Don't have an account? <Link to="/signup">Signup</Link>
//       </span>
//     </form>
//     <ToastContainer />
//   </div>
// </div>

//   );
// }

// export default Login;
