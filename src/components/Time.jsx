import React from 'react'

function Time() {
   
    function formatToMinute(date) {
        // Get date components
        const dateString = date.toDateString();
    
        // Get time components
        const hours = date.getHours();
        const minutes = date.getMinutes();
    
        // Format the time
        const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    
        // Combine date and time
        const formattedDateTime = `${dateString} at ${formattedTime}`;
    
        return formattedDateTime;
    }
    
    // Create a new Date object representing the current date and time
    const currentDate = new Date();
    
    // Format the date to include only day of the week, month, day, year, and time up to the minute
    const formattedDateTime = formatToMinute(currentDate);
  return (
    <>
        <p className='text-end'>{`Updated On: ${formattedDateTime}`}</p>
    </>
  )
}

export default Time