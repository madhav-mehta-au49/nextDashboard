import React from "react";

export default function ProfileInsightsCard({ views, searches }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9"/></svg>
        </span>
        <h2 className="text-lg font-semibold">Profile Insights</h2>
      </div>
      <div className="flex gap-8 mt-2">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-primary-700">{views}</span>
          <span className="text-xs text-gray-500">Profile Views</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-primary-700">{searches}</span>
          <span className="text-xs text-gray-500">Search Appearances</span>
        </div>
      </div>
    </section>
  );
}
