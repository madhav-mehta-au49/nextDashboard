import React from "react";

export default function MessagesCard({ messages }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </span>
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      {messages.length === 0 ? (
        <p className="text-gray-500">No new messages.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {messages.map((msg, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{msg.from}</div>
                <div className="text-xs text-gray-500">{msg.subject}</div>
              </div>
              <span className="text-xs text-primary-700">{msg.date}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">Go to Inbox</button>
    </section>
  );
}
