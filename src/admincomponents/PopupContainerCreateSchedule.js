import React, { useState } from 'react';
import CreateSchedule from './CreateSchedule';

const PopupContainerCreateSchedule = ({ token, username }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <button onClick={togglePopup}>Open Schedule Form</button>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <button className="close-btn" onClick={togglePopup}>Close</button>
            <CreateSchedule token={token} username={username} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupContainer;
