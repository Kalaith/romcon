import { AuthPanel } from '../components/AuthPanel';
import { PlannerWorkspace } from '../components/PlannerWorkspace';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center px-4 py-12 text-sm text-rose-800">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center px-4 py-12">
        <AuthPanel />
      </div>
    );
  }

  return <PlannerWorkspace />;
}
