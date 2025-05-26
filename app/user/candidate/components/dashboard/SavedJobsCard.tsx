import React from "react";

export default function SavedJobsCard({ jobs }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 5v14l7-7 7 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/></svg>
        </span>
        <h2 className="text-lg font-semibold">Saved Jobs</h2>
      </div>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No saved jobs.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {jobs.map((job, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{job.job}</div>
                <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
              </div>
              <button className="text-xs text-red-500 hover:underline">Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-4 w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">View All Saved Jobs</button>
    </section>
  );
}
