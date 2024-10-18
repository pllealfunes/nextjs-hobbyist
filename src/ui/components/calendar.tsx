"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { postEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const PostCalendar = () => {
  const [view, setView] = useState<View>(Views.MONTH);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={postEvents}
      startAccessor="start"
      endAccessor="end"
      views={["month"]}
      view={view}
      style={{ height: 500, width: 500 }}
      onView={handleOnChangeView}
    />
  );
};

export default PostCalendar;
