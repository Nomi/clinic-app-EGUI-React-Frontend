import React, { useState } from 'react';
import backendURL from '../Config';
import getMondayOfWeek from '../common/getMondayOfWeek';
import { getWeek } from 'date-fns';

const CreateSchedule = ({ token, username }) => {
  const [doctorUsername, setDoctorUsername] = useState(username);
  const [dateOfMonday, setDateOfMonday] = useState('');
  const [error, setError] = useState('');
  const [entries, setEntries] = useState([{ date: '', startTimeOnly: '', endTimeOnly: '' }]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if any entry has empty start or end time
    const hasEmptyTimes = entries.some((entry) => !entry.startTimeOnly || !entry.endTimeOnly);
    if (hasEmptyTimes) {
      alert('Please fill in start and end times for all entries.');
      return;
    }
  
    // Proceed with creating the schedule
    const scheduleData = {
      doctorUsername,
      dateOfMonday,
      entries
    };
  
    try {
      const response = await fetch(`${backendURL}/create-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) {
        const responseText = await response.text();
        window.alert(response.status+ " - "+ response.statusText+ " :: "+ responseText);
        throw new Error(`Failed to create schedule: ${response.statusText}`);
      }
  
      // Handle success response
      console.log('Schedule created successfully');
      window.alert('Schedule created successfully.');
    } catch (error) {
      console.error('Error creating schedule:', error);
      window.alert(error);
      // Handle error
    }
  };

  const handleEntryChange = (index, field, value) => {
    if(field=='date')
        {
        const mondayDate = new Date(dateOfMonday);
        const updatedDate = new Date(value);
    
        // Get the week number of Monday's date and the updated date
        const mondayWeek = getWeek(mondayDate);
        const updatedWeek = getWeek(updatedDate);
    
        // If the difference is not between 0 and 6 (inclusive), it means the date is not in the same week
        if (mondayWeek!=updatedWeek) {
        setError('Date must be in the same week as Monday.');
        window.alert('Date must be in the same week as the Monday that has been set.');

        return;
        }
    
        // Check if the updated date already exists in other entries
        const isExistingDate = entries.some((entry, i) => i !== index && entry.date === value);
        
        // If the updated date already exists in other entries, set an error
        if (isExistingDate) {
        setError('An entry for this date already exists.');
        window.alert('An entry for this day of the week already exists.');

        return;
        }
    } else if (field === 'startTimeOnly') {
        // value += ":00";
        // Validate start time
        const endTime = entries[index].endTimeOnly.replace(/(:00)$/, '');;
        if (endTime && value >= endTime) {
          setError('Start time must be before end time.');
          window.alert('Start time must be before end time.');
          return;
        }
      } else if (field === 'endTimeOnly') {
        // value += ":00";
        // Validate end time
        const startTime = entries[index].startTimeOnly.replace(/(:00)$/, '');;
        if (startTime && value <= startTime) {
          setError('End time must be after start time.');
          window.alert('End time must be after start time.');
          return;
        }
      }
  
    // Clear any existing error message
    setError(null);
  
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    if(field=='startTimeOnly'||field=='endTimeOnly')
    {
        updatedEntries[index][field] += ":00";
    }
    setEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    // Check if an entry with the selected date already exists
    // const isExistingDate = entries.some(entry => entry.date === dateOfMonday);
    
    // if (isExistingDate) {
    //   setError('An entry for this date already exists.');
    //   window.alert('An entry for this day of the week already exists.');
    //   return; // Exit early if an entry for the selected date already exists
    // }
    
    // If no entry with the selected date exists, add a new entry
    setEntries([...entries, { date: '', startTimeOnly: '', endTimeOnly: '' }]);
    setError('');
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = [...entries];
    updatedEntries.splice(index, 1);
    setEntries(updatedEntries);
  };


  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate.getDay() === 1) {
      setDateOfMonday(e.target.value); // Set dateOfMonday only if selected date is a Monday
    } else {
      // Display an error message or prevent setting the date if it's not a Monday
      console.error('Please select a Monday.');
      window.alert('Please select a Monday.');
      // Optionally, you can show an error message to the user
    }
  };

  const handleEntryDuplicateCheck = () => {
    // Check if an entry with the selected date already exists
    const isExistingDate = entries.some(entry => entry.date === dateOfMonday);
    
    if (isExistingDate) {
      console.error('An entry for this date already exists.');
      window.alert('An entry for this date already exists.');
      // Optionally, you can show an error message to the user
      return; // Exit early if an entry for the selected date already exists
    }
    
    // If no entry with the selected date exists, add a new entry
    setEntries([...entries, { date: dateOfMonday, startTimeOnly: '', endTimeOnly: '' }]);
  };

  

  
  return (
    <div>
      <h2>Create Schedule</h2>
      <form onSubmit={handleSubmit}>
        <label hidden>
          Doctor Username:
          <input type="text" value={doctorUsername} onChange={(e) => e.target.value=doctorUsername}/>
        </label>
        <label>
          Date of Monday:
          <input type="date" value={dateOfMonday} onChange={handleDateChange} />
        </label>
        {entries.map((entry, index) => (
          <div key={index}>
            <label>
              Date:
              <input type="date" value={entry.date} onChange={(e) => handleEntryChange(index, 'date', e.target.value)} />
            </label>
            <label>
              Start Time:
              <input type="time" value={entry.startTimeOnly} onChange={(e) => handleEntryChange(index, 'startTimeOnly', e.target.value)} />
            </label>
            <label>
              End Time:
              <input type="time" value={entry.endTimeOnly} onChange={(e) => handleEntryChange(index, 'endTimeOnly', e.target.value)} />
            </label>
            <button type="button" onClick={() => handleRemoveEntry(index)}>Remove Entry</button>
          </div>
        ))}
        <button type="button" onClick={handleAddEntry}>Add Entry</button>
        <br/>
        <button type="submit">Create Schedule</button>
      </form>
    </div>
  );
};

export default CreateSchedule;
