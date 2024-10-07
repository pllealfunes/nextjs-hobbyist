"use client";

import * as React from "react";
import PostCards from "@/ui/components/postCards";
import { Calendar } from "@/ui/components/calendar";

export default function Dashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <PostCards />
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow"
        />

        {/* Statistics Section */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100 rounded-lg text-center">
            <h4 className="text-xl font-bold">Posts</h4>
            <p className="text-2xl">23</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg text-center">
            <h4 className="text-xl font-bold">Followers</h4>
            <p className="text-2xl">200</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg text-center">
            <h4 className="text-xl font-bold">Likes</h4>
            <p className="text-2xl">150</p>
          </div>
        </div>
      </div>
    </>
  );
}
