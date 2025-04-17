"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import EmployeeHeader from "../../../../../components/EmployeeHeader";
import SubHeader from "../../../../../components/subheader";
import Footer from "../../../../../components/footer";

export default function ApplyPage() {
  const methods = useForm();
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([
    { id: 1, title: "Frontend Developer", status: "Under Review" },
    { id: 2, title: "UI/UX Designer", status: "Shortlisted" },
  ]);

  const jobTitle = "Software Engineer";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setFileName(e.target.files[0].name);
        setIsUploading(false);
      }, 1000);
    }
  };

  const onSubmit = (data: any) => {
    console.log("Application Data:", data);
    const newJob = { id: appliedJobs.length + 1, title: jobTitle, status: "Pending" };
    setAppliedJobs([...appliedJobs, newJob]);
    router.push("/application-status");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <EmployeeHeader />
      <SubHeader />

      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 px-6 py-10">
        <div className="w-full lg:w-2/3 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
            Apply for {jobTitle}
          </h1>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("name", { required: true })} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("email", { required: true })} />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input type="tel" placeholder="+1 234 567 890" className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("phone", { required: true })} />
              </div>

              {/* Current City */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Current City</label>
                <input type="text" placeholder="New York" className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("city")} />
              </div>

              {/* Preferred Job Location */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Preferred Job Location</label>
                <input type="text" placeholder="San Francisco, Remote, etc." className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("preferredLocation")} />
              </div>

              {/* Highest Qualification */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Highest Qualification</label>
                <select className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("qualification")}>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Years of Experience</label>
                <input type="number" placeholder="3" className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("experience")} />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Certifications</label>
                <input type="text" placeholder="AWS, PMP, etc." className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("certifications")} />
              </div>

              {/* Expected Salary */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Expected Salary</label>
                <input type="text" placeholder="$80,000" className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  {...methods.register("expectedSalary")} />
              </div>

              {/* Resume Upload */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-1">Upload Resume</label>
                <div className="flex items-center justify-center w-full border rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <input type="file" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={handleFileChange} {...methods.register("resume", { required: true })} />
                  {isUploading ? (
                    <span className="text-gray-500">Uploading...</span>
                  ) : fileName ? (
                    <span className="text-green-600 flex items-center">
                      <FiCheckCircle className="mr-2" /> {fileName}
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center">
                      <FiUpload className="mr-2" /> Click to upload
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-teal-500 text-white p-3 rounded-lg font-bold hover:bg-teal-600 transition">
                Submit Application
              </button>
            </form>
          </FormProvider>
        </div>

        {/* Application Summary */}
        <div className="w-full lg:w-1/3 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
            Application Summary
          </h2>
          <p className="text-center text-gray-600 mb-6">
            You have applied for <span className="font-bold">{appliedJobs.length}</span> jobs.
          </p>

          <div className="space-y-4">
            {appliedJobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <h3 className="font-semibold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500">Status: {job.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
