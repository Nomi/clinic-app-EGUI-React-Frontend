// DetailedScheduleTable.js
import React, { useState, useEffect } from 'react';
import backendURL from '../Config';
import { tab } from '@testing-library/user-event/dist/tab';


const DetailedScheduleTable = ({ doctorUsername, token }) => {
  // Define inline styles for table header and cell
  const tableHeaderStyle = {
    border: '1px solid #dddddd',
    padding: '8px',
    textAlign: 'left',
  };

  const tableCellStyle = {
    border: '1px solid #dddddd',
    padding: '8px',
  };

  const unsubscribeButtonStyle={
    color: 'red'
  }
  const subscribeButtonStyle={
    color: 'green'
  }

  const [detailedSchedule, setDetailedSchedule] = useState(null);

  const fetchSchedule = async () => {
    let data;
    try {
       data = await fetch(`${backendURL}/get-detailed-future-schedule-for-doctor?docUsername=`+doctorUsername, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const temp = await data.json();
      setDetailedSchedule(temp);//temp.appointmentSlots ? temp.appointmentSlots : []);
    } catch (error) {
      console.error('Error fetching detailed schedule for doctor:', error);
      window.alert(error);
    }
  };
  
  useEffect(() => {

    fetchSchedule();

    // // Cleanup function
    // return () => {
    //   setDetailedSchedule(null); // Reset detailedSchedule when component unmounts
    // };
  }, [doctorUsername, token]);



  const toggleSubscription = async (visitSlotId,isUnsubscribe) => {
    try {
      const response = await fetch(`${backendURL}/subscribe-or-unsubscribe-appointment?visitSlotId=${visitSlotId}&isUnsubscribe=${isUnsubscribe}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to subscribe appointment: ${response.statusText}`);
      }
      
      // Handle success if needed
      fetchSchedule();
    } catch (error) {
      console.error('Error subscribing appointment:', error);
      window.alert(error);
    }
  };

  return (
    <div>
      <h2>Detailed Schedule</h2>
      {detailedSchedule ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Start Time</th>
            <th style={tableHeaderStyle}>End Time</th>
            <th style={tableHeaderStyle}>Description</th>
            <th style={tableHeaderStyle}>Action</th>
              {/* Add more columns if needed */}
            </tr>
          </thead>
          <tbody>
            {detailedSchedule.appointmentSlots.sort((a,b) => a.parentScheduleEntry.date.split('T')[0].toLowerCase().localeCompare(b.parentScheduleEntry.date.split('T')[0].toLowerCase())).map((slot) => (
            <tr key={slot.id}>
              <td style={tableCellStyle}>{slot.parentScheduleEntry.date.split('T')[0]}</td>
              <td style={tableCellStyle}>{slot.startTime.split('.')[0]}</td>
              <td style={tableCellStyle}>{slot.endTime.split('.')[0]}</td>
              <td style={tableCellStyle}>{slot.description}</td>
              <td style={tableCellStyle}>
                {/* since the endpoint only gets current patient's and unsubscribed appointments, we can use the following logic: */}
                {slot.patient ? 
                  <button style={unsubscribeButtonStyle} onClick={() => toggleSubscription(slot.id,true)}>unsubscribe</button> 
                  : 
                  <button style={subscribeButtonStyle} onClick={() => toggleSubscription(slot.id,false)}>subscribe</button>
                } 
              </td>
              {/* Add more cells if needed */}
            </tr>
            ))}
          </tbody>
        </table>
      ) 
      : (
        <p>Loading...</p>
      )
      }
    </div>
  );
};

export default DetailedScheduleTable;
