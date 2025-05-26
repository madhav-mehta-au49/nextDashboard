import React from "react";

export default function CareerToolsSidebar({ resources, skills, events }) {
  return (
    <aside className="space-y-6">
      {/* Resources */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold mb-3 text-teal-700">Career Resources</h3>
        <ul className="space-y-2">
          {resources.map(res => (
            <li key={res.id}>
              <a href={res.link} target="_blank" rel="noopener" className="text-blue-600 hover:underline font-medium">{res.title}</a>
              <div className="text-xs text-gray-500">{res.description}</div>
            </li>
          ))}
        </ul>
      </section>
      {/* Trending Skills */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold mb-3 text-teal-700">Trending Skills</h3>
        <ul className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <li key={skill.id}>
              <a href={skill.link} target="_blank" rel="noopener" className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700 hover:bg-teal-100">{skill.title}</a>
            </li>
          ))}
        </ul>
      </section>
      {/* Upcoming Events */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold mb-3 text-teal-700">Upcoming Events</h3>
        <ul className="space-y-2">
          {events.map(event => (
            <li key={event.id}>
              <a href={event.link} target="_blank" rel="noopener" className="text-blue-600 hover:underline font-medium">{event.title}</a>
              <div className="text-xs text-gray-500">{event.date}</div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
