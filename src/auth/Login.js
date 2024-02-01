// Login.js
import React, { useState } from 'react';
import backendURL from '../Config';


const Login = ({ handleLoginClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);
  // const [role, setRole] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    let errorData = undefined;
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
      if (!response.ok) {
        errorData = await response;//.json();
        throw new Error(errorData.message || 'Either you have enetered invalid parameters OR your Patient account has not been verified from our side yet. Status Code: '+response.status);
      }
  
      const data = await response.json();
      // setToken(data.token);
      // setRole(data.role);
      handleLoginClick(data.token,data.role,formData.username);
      // Handle role if needed (data.role)
    } catch (error) {
      console.error('Error during login:', error);
      if(errorData && errorData.message)
      {
        window.alert(errorData.message);
      }
      else
      {
        window.alert('Error: ' + error);
      }
    } finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Username:</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} />
      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} />
      {!loading && <button
                    onClick={handleLogin}
                    style={{
                      backgroundColor: loginHovered ? 'lime' : 'transparent',
                      color: loginHovered ? 'black' : 'lime',
                      border: '2px solid red',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s, color 0.4s',
                    }}
                    onMouseEnter={() => setLoginHovered(true)}
                    onMouseLeave={() => setLoginHovered(false)}
                    >Login</button>}
      {loading && <p>Loading...</p>}
      {/* {token && <p>Token: {token}</p>} */}
    </div>
  );
};

export default Login;
