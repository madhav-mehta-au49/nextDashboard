import { redirect } from 'next/navigation';

export default function EmployeeDashboardPage() {
  // Redirect to home page where role-based content is handled
  redirect('/');
}