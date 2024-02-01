import React, {useState} from 'react';
import backendURL from '../Config';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import SignupDoctor from '../admincomponents/Signup-Doctor';
import VerifyPatient from '../admincomponents/VerifyPatient';
import DoctorListPopup from '../admincomponents/DoctorListPopup';
import { AccordionBody } from 'react-bootstrap';
import { cloneScheduleFromLastWeek } from '../admincomponents/CloneScheduleFunction';
import CreateSchedule from '../admincomponents/CreateSchedule';

const AdminControlPanel = ({ token }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleSelectDoctor = (doctor) => {
        setIsPopupOpen(false);
        setSelectedDoctor(doctor);
    };
    const handleCloneSchedule = async () => {
        try {
          const response = await cloneScheduleFromLastWeek(selectedDoctor, token);
    
          // Handle the response as needed
          console.log('Schedule cloned successfully:', response);
          window.alert('Schedule cloned succesfully');
        } catch (error) {
          // Handle errors
          console.error('Error cloning schedule:', error.message);
          // You might want to show an error message to the user
          window.alert('Error cloning schedule: ' + error.message);
        }
      };
      
    
    return (
        <div>
            <h2>Admin Control Panel</h2>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Create Doctor Account</Accordion.Header>
                    <Accordion.Body>
                        <SignupDoctor token={token}/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Verify Patient Account</Accordion.Header>
                    <Accordion.Body>
                        <VerifyPatient token={token}/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Manage Doctors (and their schedules)</Accordion.Header>
                    <AccordionBody>
                        {/* <button onClick={handleshowAllDoctorsPopup}>Show Doctor List</button> */}
                    <DoctorListPopup onSelectDoctor={handleSelectDoctor} token={token} />
                    {selectedDoctor && (
                        <div>
                        <h2>Selected Doctor</h2>
                        <p>Name: {selectedDoctor.name}</p>
                        <p>Username: {selectedDoctor.username}</p>
                        <p>Speciality: {selectedDoctor.speciality}</p>
                        <button onClick={handleCloneSchedule}>Clone Schedule from Last Week to Current Week</button>
                        <br/>
                        <br/>
                        <button onClick={togglePopup}>Show/Hide Schedule Creation Form</button>
                        {isPopupOpen && selectedDoctor && (
                            <div className="popup">
                            <div className="popup-inner">
                                <button className="close-btn" onClick={togglePopup}>Close(and reset fields)</button>
                                <CreateSchedule token={token} username={selectedDoctor.username} />
                            </div>
                            </div>
                        )}
                        </div>
                    )}
                    </AccordionBody>
                </Accordion.Item>
            </Accordion>
        </div>
      );
};

export default AdminControlPanel;