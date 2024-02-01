// DetailedScheduleTable.js
import React, { useState, useEffect } from 'react';
import backendURL from '../Config';

const DoctorDetailedScheduleTable = ({ doctorUsername, token }) => {
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
  



  const [editedDescriptions, setEditedDescriptions] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const handleDescriptionChange = (event, slotId) => {
    setEditedDescriptions({
      ...editedDescriptions,
      [slotId]: event.target.value,
    });
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    fetchSchedule();
  }

  const handleEditDescription = async (slotId) => {
    const editedDescription = editedDescriptions[slotId];
    try {
      const response = await fetch(`${backendURL}/set-visit-description?visitSlotId=${slotId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/json',
        },
        body: '\"'+editedDescription+'\"',
      });

      if (!response.ok) {
        throw new Error(`Failed to update description: ${response.statusText}`);
      }

      // Fetch the updated detailed schedule after updating the description
      setIsEditing(false);
      fetchSchedule();
    } catch (error) {
      console.error('Error updating description:', error);
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
            </tr>
          </thead>
          <tbody>
            {detailedSchedule.appointmentSlots.filter(s=> s.patient!=null && s.patient!=undefined).map((slot) => (
            <tr key={slot.id}>
              <td style={tableCellStyle}>{slot.parentScheduleEntry.date.split('T')[0]}</td>
              <td style={tableCellStyle}>{slot.startTime.split('.')[0]}</td>
              <td style={tableCellStyle}>{slot.endTime.split('.')[0]}</td>
              <td style={tableCellStyle}>
                  {isEditing ?
                    <input
                    type="text"
                    value={editedDescriptions[slot.id] ?? slot.description}
                    onChange={(event) => handleDescriptionChange(event, slot.id)}
                  />
                    :
                    <td style={tableCellStyle}>{slot.description}</td>
                  }
                </td>
                <td style={tableCellStyle}>
                  {isEditing ?
                    <button onClick={() => handleEditDescription(slot.id)}>Save</button>
                    :
                    <button onClick={() => handleStartEditing()}>Edit</button>
                  }
                </td>
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

export default DoctorDetailedScheduleTable;
