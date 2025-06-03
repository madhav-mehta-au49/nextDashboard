"use client";

import React, { useEffect } from 'react';
import EmployeeHeader from '../../components/EmployeeHeader';
import { setMockCandidateProfile, clearMockCandidateProfile } from '../services/candidate/candidateApi';

export default function TestCandidateHeader() {
  useEffect(() => {
    // Set candidate role for testing
    localStorage.setItem('userRole', 'candidate');
    localStorage.setItem('userPoints', '42');
  }, []);

  const simulateExistingProfile = () => {
    setMockCandidateProfile({
      id: 1,
      slug: 'mehta-madhav',
      first_name: 'Mehta',
      last_name: 'Madhav',
      completion_percentage: 100,
      title: 'Software Developer'
    });
    // Refresh the page to see changes
    window.location.reload();
  };

  const simulateNoProfile = () => {
    clearMockCandidateProfile();
    // Refresh the page to see changes
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader />

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Candidate Header</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>
          <p className="text-gray-600 mb-6">
            Use the buttons below to simulate different candidate profile states and see how the header changes.
          </p>

          <div className="space-x-4">
            <button
              onClick={simulateExistingProfile}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Simulate Existing Profile (100% Complete)
            </button>

            <button
              onClick={simulateNoProfile}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Simulate No Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>Header Title:</strong> Should show "Candidate Portal" (since userRole is set to 'candidate')</li>
            <li>• <strong>With Existing Profile:</strong> Profile dropdown should show "View Profile" with completion percentage</li>
            <li>• <strong>Without Profile:</strong> Profile dropdown should show "Create Profile" option</li>
            <li>• <strong>Loading State:</strong> Should briefly show loading spinner while fetching profile</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
