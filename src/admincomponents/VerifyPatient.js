import React, { useState } from 'react';
import backendURL from '../Config';

const VerifyPatient = ({token}) => {
  const [patientUsername, setPatientUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      if(!patientUsername)
      {
        throw new Error('Patient username cannot be empty.');
      }
      const response = await fetch(backendURL+`/verify-patient?patientUsername=${patientUsername}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Verification successful');
      } else {
        window.alert(JSON.stringify(data.message))
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Verify Patient</h2>
      <label htmlFor="patientUsername">Patient Username:</label>
      <input 
        type="text" 
        id="patientUsername" 
        value={patientUsername} 
        onChange={(e) => setPatientUsername(e.target.value)} 
      />
      <button onClick={handleVerify} disabled={loading}>Verify</button>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyPatient;
