import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PieController,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React from 'react';
import {
  Bar,
  Line,
  Pie,
  Scatter
} from 'react-chartjs-2';

// Remove Chakra UI imports:
// import { Box, SimpleGrid, Text } from '@chakra-ui/react';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Title,
  Tooltip,
  Legend
); 

interface CardProps {
  title: string;
  ChartComponent: React.ComponentType<any>;
  chartData: any;
}

const Card = ({ title, ChartComponent, chartData }: CardProps) => (
  <div 
    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300"
  >
    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
      {title}
    </h3>
    <ChartComponent data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
  </div>
);

const AdminDashboard = ({ cardData }: { cardData: Array<{ title: string; component: React.ComponentType<any>; data: any }> }) => (
  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {cardData.map((card, index) => (
      <Card
        key={index}
        title={card.title}
        ChartComponent={card.component}
        chartData={card.data}
      />
    ))}
  </div>
);

export default AdminDashboard;
