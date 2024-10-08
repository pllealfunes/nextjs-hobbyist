"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import the default styles

const CalendarComponent = () => {
  const [value, setValue] = useState(new Date());

  return (
    <div className="calendar-container">
      <Calendar value={value} />
    </div>
  );
};

export default CalendarComponent;
