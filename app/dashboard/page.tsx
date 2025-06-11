import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to home page as main dashboard is there
  redirect('/');
}