import React from "react";

export default function NotificationsCard({ notifications }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9"/></svg>
        </span>
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((note, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="text-gray-800 dark:text-gray-100 text-sm">{note.message}</span>
              </div>
              <span className="text-xs text-gray-400">{note.date}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">View All Notifications</button>
    </section>
  );
}
