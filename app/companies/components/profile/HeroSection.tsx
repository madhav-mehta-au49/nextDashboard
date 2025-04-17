"use client"
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative bg-white">
      {/* Cover Background */}
      <div className="relative h-[360px] w-full bg-gradient-to-r from-white to-gray-100 overflow-hidden">
        <Image
          src="/company-cover.jpg" // replace with your actual cover image path
          alt="Cover"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-blue-50" />
        {/* Visual Circles */}
        <div className="absolute right-10 top-10 flex flex-wrap w-[300px] gap-3 justify-center items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image src="/ai.jpg" alt="AI" width={96} height={96} />
          </div>
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image src="/robotics.jpg" alt="Robotics" width={96} height={96} />
          </div>
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image src="/planning.jpg" alt="Planning" width={96} height={96} />
          </div>
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image src="/woman.jpg" alt="Tech" width={96} height={96} />
          </div>
        </div>
      </div>

      {/* Company Info Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-16 -mt-16 relative z-10">
        <div className="flex items-center gap-4">
          {/* Company Logo */}
          <div className="w-40 h-40 bg-white rounded-xl p-2 shadow-md">
            <Image
              src="/logo.png" // replace with your logo image path
              alt="Company Logo"
              width={160}
              height={160}
              className="rounded-xl"
            />
          </div>

          {/* Company Name & Tags */}
          <div className="mt-4 md:mt-0">
            <h2 className="text-3xl font-bold text-gray-900">Cirruslabs</h2>
            <p className="text-gray-600 text-sm">Digital Transformation Simplified</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                IT Services & Consulting
              </span>
              <span className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                Foreign MNC
              </span>
              <span className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                B2B
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <CheckCircle className="text-green-500 mr-1 w-4 h-4" />
              Managed by employer
            </div>
          </div>
        </div>

        {/* Follow Section */}
        <div className="flex items-center mt-6 md:mt-0 gap-4">
          <p className="text-gray-500 text-sm">565 followers</p>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition">
            + Follow
          </button>
        </div>
      </div>
    </div>
  );
}
