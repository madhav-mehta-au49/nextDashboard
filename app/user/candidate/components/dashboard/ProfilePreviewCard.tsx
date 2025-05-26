import React from "react";

export default function ProfilePreviewCard({ name, avatar }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center gap-4">
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-500 shadow">
        {avatar ? (
          <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-4xl text-teal-600 font-bold">
            {name ? name[0] : "?"}
          </div>
        )}
      </div>
      <h2 className="text-lg font-semibold">Profile Preview</h2>
      <p className="text-gray-500 text-sm mb-2">See how your profile appears to recruiters.</p>
      <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">View Profile</button>
    </section>
  );
}
