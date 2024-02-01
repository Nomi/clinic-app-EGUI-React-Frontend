// api.js (or any other utility/service file)

import backendURL from "../Config";

export const cloneScheduleFromLastWeek = async (doctor, token) => {
  try {
    const response = await fetch(`${backendURL}/clone-schedule?doctorUsername=${doctor.username}&sourceWeekOffset=-1&targetWeekOffset=0`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to clone schedule: ${response.statusText} (${response.status}) :: ${responseData.message}`);
    }

    const data = await response;
    return data;
  } catch (error) {
    throw new Error(`Error cloning schedule: ${error.message}`);
  }
};
