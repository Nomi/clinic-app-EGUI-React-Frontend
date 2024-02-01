const getMondayOfWeek = (date) => {
    const currentDate = new Date(date); // Create a new Date object with the given date
    const dayOfWeek = currentDate.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const difference = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Calculate the difference to Monday
    
    const monday = new Date(currentDate); // Create a new Date object based on the given date
    monday.setDate(difference); // Set the date to the Monday of the week
    
    return monday.getDate();
    };

export default getMondayOfWeek;