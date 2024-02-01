import React from 'react';
import backendURL from '../Config';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DoctorDetailedScheduleTable from '../doctorcomponents/DoctorDetailedAppointmentsTable';

const DoctorControlPanel = ({token ,username}) => {
    return (
        <div>
            <h2>Doctor Control Panel</h2>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Manage Appointments</Accordion.Header>
                    <Accordion.Body>
                        <DoctorDetailedScheduleTable doctorUsername={username} token={token}/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
      );
};

export default DoctorControlPanel;