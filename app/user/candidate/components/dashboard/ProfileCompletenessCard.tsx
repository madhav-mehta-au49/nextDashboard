import React from "react";

export default function ProfileCompletenessCard({ completeness, sections }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Progress ring */}
          <svg className="w-16 h-16" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-teal-500"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${completeness}, 100`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-teal-700">
            {completeness}%
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-1">Profile Completeness</h2>
          <p className="text-gray-500 text-sm">Complete your profile to get better job matches.</p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2 mt-2">
        {sections.map(section => (
          <li key={section.label} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${section.completed ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-500'}`}>
            {section.completed ? (
              <span className="inline-block w-3 h-3 bg-teal-500 rounded-full"></span>
            ) : (
              <span className="inline-block w-3 h-3 border border-gray-400 rounded-full"></span>
            )}
            {section.label}
          </li>
        ))}
      </ul>
      <button className="mt-2 self-end px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">Edit Profile</button>
    </section>
  );
}
