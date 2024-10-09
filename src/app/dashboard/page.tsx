"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import DashboardPosts from "@/ui/components/dashboardPosts";

export default function Dashboard() {
  return (
    <section className="bg-zinc-50 min-h-screen">
      <div className="mx-auto justify-evenly items-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
            Feed
          </h2>
          <div className="h-1 w-1/4 bg-rose-500 mx-auto mb-6"></div>
          <p className="text-center text-gray-600 text-lg mb-6">
            Stay updated with the latest posts and insights from our community.
          </p>
          <div className="mb-6 flex justify-center items-center gap-2">
            <label htmlFor="search" className="sr-only">
              Search posts
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search posts..."
              className="md:w-1/3 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="filter" className="sr-only">
              Filter posts
            </label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="category1">Category 1</SelectItem>
                <SelectItem value="category2">Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DashboardPosts />
        </div>
      </div>
    </section>
  );
}
