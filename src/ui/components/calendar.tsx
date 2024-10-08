"use client";

import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import the default styles

const CalendarComponent = () => {
  return (
    <div className="calendar-container">
      <Calendar />
    </div>
  );
};

export default CalendarComponent;
