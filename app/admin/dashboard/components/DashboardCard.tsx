interface DashboardCardProps {
  label: string
  value: string | number
  helpText: string
}

const DashboardCard = ({ label, value, helpText }: DashboardCardProps) => {
  return (
    <div className="col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{value}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{helpText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard
