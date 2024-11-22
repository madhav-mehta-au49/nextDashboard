import { Box, SimpleGrid, Text } from '@chakra-ui/react';
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
  <Box
    borderWidth="1px"
    borderRadius="lg"
    p={4}
    boxShadow="sm"
    background="white"
    _hover={{ boxShadow: 'lg' }}
  >
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      {title}
    </Text>
    <ChartComponent data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
  </Box>
);

const AdminDashboard = ({ cardData }: { cardData: Array<{ title: string; component: React.ComponentType<any>; data: any }> }) => (
  <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6} p={6}>
    {cardData.map((card, index) => (
      <Card
        key={index}
        title={card.title}
        ChartComponent={card.component}
        chartData={card.data}
      />
    ))}
  </SimpleGrid>
);
export default AdminDashboard;