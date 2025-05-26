import React from "react";

export default function ApplicationsCard({ applications }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 17v1a3 3 0 01-6 0v-1M12 3v12m0 0l-3-3m3 3l3-3"/></svg>
        </span>
        <h2 className="text-lg font-semibold">Recent Applications</h2>
      </div>
      {applications.length === 0 ? (
        <p className="text-gray-500">No recent applications.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {applications.map((app, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">{app.job[0]}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{app.job}</div>
                  <div className="text-xs text-gray-500">{app.company} • {app.date}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'Interview Scheduled' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{app.status}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">View All Applications</button>
    </section>
  );
}
