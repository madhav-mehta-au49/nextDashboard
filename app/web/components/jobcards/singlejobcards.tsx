import Link from "next/link"
import { FiEye, FiSend } from "react-icons/fi"

export const SingleJobCards = ({ title, description, jobId }: { title: string; description: string; jobId: string }) => {
  return (
    <div 
      className="w-full h-full min-h-[280px] flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 hover:shadow-teal-200/50 transition-all duration-200"
    >
      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-xl font-bold mb-4 leading-tight">
          <p className="line-clamp-2">
            {title}
          </p>
        </h3>
        <div className="text-gray-600 text-md leading-relaxed">
          <p className="line-clamp-3">
            {description}
          </p>
        </div>
      </div>
      <div 
        className="flex justify-between p-6 border-t border-gray-100"
      >
        <Link href={`user/jobs/${jobId}`}>
          <button
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-white border border-teal-500 rounded-md hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
          >
            <FiEye className="w-3.5 h-3.5" />
            View Details
          </button>
        </Link>
        <Link href={`user/jobs/${jobId}/apply`}>
          <button
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
          >
            <FiSend className="w-3.5 h-3.5" />
            Apply Now
          </button>
        </Link>
      </div>
    </div>
  )
}
