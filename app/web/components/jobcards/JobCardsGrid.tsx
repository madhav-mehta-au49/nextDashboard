import { SingleJobCards } from "./singlejobcards"

interface JobDetail {
  title: string;
  description: string;
  id: string;
}

export const JobCardsGrid = ({ jobs, title = "Available Jobs" }: { jobs: JobDetail[], title?: string }) => {
  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{title}</h2>
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 justify-items-center items-stretch"
      >
        {jobs.map((job, index) => (
          <div key={index} className="w-full">
            <SingleJobCards
              title={job.title}
              description={job.description}
              jobId={job.id}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
