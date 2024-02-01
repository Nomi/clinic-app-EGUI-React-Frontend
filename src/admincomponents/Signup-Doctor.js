// Signup-Doctor.js
import React, { useState } from 'react';
import backendURL from '../Config';

const SignupDoctor = ({ token }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      username: '',
      password: '',
      doctorSpecialty: '', // State to manage selected speciality
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

      const response = await fetch(`${backendURL}/register-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSignupSuccess(true);
      } else {
        setSignupSuccess(false);
        // Handle signup error
        const responseData = await response.json();
        window.alert(`${response.statusText} (${response.status}) :: ${responseData.message}`)
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert('Error: ' + error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
      <label>Email:</label>
      <input type="text" name="email" value={formData.email} onChange={handleChange} required/>
      <label>Username:</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} required/>
      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
      {/* Dropdown for selecting speciality */}
      <label htmlFor="speciality">Speciality:</label>
      <select id="doctorSpecialty" name="doctorSpecialty" value={formData.doctorSpecialty} onChange={handleChange} required>
        {/* <option value="">Select Speciality</option> */}
        <option value="Home">Home</option>
        <option value="ENT">ENT</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="Ophtalmologist">Ophtalmologist</option>
        <option value="Neurologist">Neurologist</option>
        <option value="Orthopedist">Orthopedist</option>
        <option value="Pediatrician">Pediatrician</option>
      </select>
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <button onClick={handleSignup}>Signup</button>

      {signupSuccess && <p>Signup successful!</p>}
    </div>
  );
};

export default SignupDoctor;
