import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiCheck, FiClock, FiEye, FiLoader } from "react-icons/fi";
import { formatDistanceToNow } from 'date-fns';

interface Application {
  id: string;
  job_id: string;
  title: string;
  company: string;
  company_logo: string;
  status: string;
  applied_at: string;
  updated_at: string;
  job_url: string;
}

export default function ApplicationStatusCard({ candidateId }: { candidateId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${API_BASE}/candidates/${candidateId}/applications`);        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        
        const data = await response.json() as { data: Application[] };
        setApplications(data.data || []);} catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchApplications();
    }
  }, [candidateId]);

  // Show up to 3 recent applications
  const recent = applications.slice(0, 3);

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
            <FiEye className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-semibold">Application Status</h2>
        </div>
        <div className="flex justify-center items-center py-6">
          <FiLoader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
            <FiEye className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-semibold">Application Status</h2>
        </div>
        <p className="text-red-500">Error loading applications. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
          <FiEye className="w-5 h-5" />
        </span>
        <h2 className="text-lg font-semibold">Application Status</h2>
      </div>
      {recent.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {recent.map((job) => (
            <li key={job.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                <div className="text-xs text-gray-500">{job.company} • {job.applied_at}</div>
              </div>
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'applied' ? 'bg-green-100 text-green-700' :
                  job.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' :
                      job.status === 'interview' ? 'bg-yellow-100 text-yellow-700' :
                        job.status === 'offered' ? 'bg-indigo-100 text-indigo-700' :
                          job.status === 'hired' ? 'bg-teal-100 text-teal-700' :
                            job.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'
                }`}>
                {job.status === 'applied' ? <FiCheck size={14} /> : <FiClock size={14} />}
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link href="/user/jobs/applicationStatus" className="mt-4 w-full inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-center transition">View All Applications</Link>
    </section>
  );
}
