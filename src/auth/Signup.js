// Signup.js
import React, { useState } from 'react';
import backendURL from '../Config';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });

  const [signupSuccess, setSignupSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must have at least 8 characters, including at least 1 number, 1 special character, 1 lowercase letter, and 1 uppercase letter.'
      );
      window.alert('Error: Password must have at least 8 characters, including at least 1 number, 1 special character, 1 lowercase letter, and 1 uppercase letter.')
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      if (!validatePassword(formData.password)) {
        return;
      }

      const response = await fetch(`${backendURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSignupSuccess(true);
      } else {
        // Handle signup error
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert('Error: ' + error.message);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} />
      <label>Email:</label>
      <input type="text" name="email" value={formData.email} onChange={handleChange} />
      <label>Username:</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} />
      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} />
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <button onClick={handleSignup}>Signup</button>

      {signupSuccess && <p>Signup successful!</p>}
    </div>
  );
};

export default Signup;
