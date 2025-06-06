"use client";
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import Header from "../../../web/components/header";
import SubHeader from "../../../../components/subheader";
import Footer from "../../../../components/footer";
import EmployeeHeader from '@/components/EmployeeHeader';
import ApplicationStatusSection from "../../components/applications/ApplicationStatusSection";

export default function ApplyHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <EmployeeHeader />
      <SubHeader />

      <div className="max-w-6xl mx-auto p-8 flex-grow">
        {/* Header Section with Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/user/jobs" className="hover:text-teal-600 flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Job Search
            </Link>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Job Application Status</h2>
              <p className="text-gray-500 text-sm">
                Not getting views on your CV? <span className="text-teal-500 cursor-pointer hover:underline">Highlight your application</span> to get recruiter's attention.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Using our reusable component */}
        <ApplicationStatusSection showSimilarJobs={true} />
      </div>

      <Footer />
    </div>
  );
}
