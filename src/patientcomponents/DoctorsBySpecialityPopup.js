import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Popover, Table, Button } from 'react-bootstrap'; // Importing Bootstrap components
import backendURL from '../Config';

const DoctorsBySpecialityPopup = ({ onSelectDoctor, token, speciality }) => {

  const [doctors, setDoctors] = useState([]);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    // Fetch list of doctors when the component mounts
    fetchDoctors(speciality);
  }, [speciality]);

  const fetchDoctors = async (speciality) => {
    try {
      const response = await fetch(`${backendURL}/get-doctors-by-speciality?doctorSpecialty=`+speciality, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors:', response.statusText);
        // Handle signup error
        const responseData = await response.json();
        window.alert(`${response.statusText} (${response.status}) :: ${responseData.message}`)
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert(error);
    }
  };

  const handleSelectDoctor = async (doctor) => {
    onSelectDoctor(doctor);
    setShowPopover(false); // Close the popover after selecting a doctor
  };

  const popover = (
    <Popover id="popover-doctor-list">
      <Popover.Header as="h3">Doctor List</Popover.Header>
      <Popover.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Speciality</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{doctor.name}</td>
                <td>{doctor.speciality}</td>
                <td>
                  <Button variant="primary" onClick={() => handleSelectDoctor(doctor)}>Select</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Popover.Body>
    </Popover>
  );
  
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      show={showPopover}
      onToggle={(show) => setShowPopover(show)}
      overlay={popover}
    >
      <Button variant="secondary">Select Doctor</Button>
    </OverlayTrigger>
  );

};

export default DoctorsBySpecialityPopup;
