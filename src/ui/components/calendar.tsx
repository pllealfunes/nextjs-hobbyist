"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { postEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const PostCalendar = () => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      date={date}
      onNavigate={(date) => {
        setDate(new Date(date));
      }}
      localizer={localizer}
      events={postEvents}
      startAccessor="start"
      endAccessor="end"
      views={["month", "day"]}
      view={view}
      style={{ height: 500, width: 520, display: "none" }}
      onView={handleOnChangeView}
      popup
    />
  );
};

export default PostCalendar;
