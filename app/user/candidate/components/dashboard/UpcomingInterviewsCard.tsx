import React from "react";

export default function UpcomingInterviewsCard({ interviews }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>
        </span>
        <h2 className="text-lg font-semibold">Upcoming Interviews</h2>
      </div>
      {interviews.length === 0 ? (
        <p className="text-gray-500">No upcoming interviews.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {interviews.map((iv, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{iv.company}</div>
                <div className="text-xs text-gray-500">{iv.role} • {iv.date} {iv.time}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${iv.status === 'Confirmed' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>{iv.status}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
