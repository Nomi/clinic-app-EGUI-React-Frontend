import React, {useState} from 'react';
import backendURL from '../Config';
import Accordion from 'react-bootstrap/Accordion';
import { AccordionBody } from 'react-bootstrap';
import DoctorsBySpecialityPopup from '../patientcomponents/DoctorsBySpecialityPopup'
import DetailedScheduleTable from '../patientcomponents/DetailedScheduleTable';

const PatientControlPanel = ({token}) => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSpeciality, setSelectedSpeciality] = useState(null);
    // setSelectedSpeciality('Home');
    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
    };
    const handleSpecialityChange = (e) => {
        // setSelectedSpeciality('NotSelected');
        setSelectedSpeciality(e.target.value);
        setSelectedDoctor(null);
    };


    return (
        <div>
            <h2>Patient Control Panel</h2>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Schedules</Accordion.Header>
                    <AccordionBody>
                    <select id="doctorSpecialty" name="doctorSpecialty" value={selectedSpeciality} onChange={handleSpecialityChange}>
                        {/* <option value="">Select Speciality</option> */}
                        <option value="NotSelected">Not Selected</option>
                        <option value="Home">Home</option>
                        <option value="ENT">ENT</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Ophtalmologist">Ophtalmologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Orthopedist">Orthopedist</option>
                        <option value="Pediatrician">Pediatrician</option>
                    </select>
                    {selectedSpeciality && selectedSpeciality != 'NotSelected' && <DoctorsBySpecialityPopup onSelectDoctor={handleSelectDoctor} speciality={selectedSpeciality} token={token} />}
                    {selectedDoctor && (
                        <div>
                        <h2>Selected Doctor</h2>
                        <p>Name: {selectedDoctor.name}</p>
                        <p>Username: {selectedDoctor.username}</p>
                        <p>Speciality: {selectedDoctor.speciality}</p>
                        <DetailedScheduleTable token={token} doctorUsername={selectedDoctor.username}/>
                        </div>
                    )}
                    </AccordionBody>
                </Accordion.Item>
            </Accordion>
        </div>
      );
};

export default PatientControlPanel;