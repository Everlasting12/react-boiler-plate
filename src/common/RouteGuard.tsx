import { Navigate } from 'react-router-dom';
import { useLoginStore } from '../store/useLoginStore';
interface RouteGuardProps {
  Component: React.ComponentType<any>;
  requiredScopes?: string[];
}
const RouteGuard: React.FC<RouteGuardProps> = ({ Component }) => {
  const { feScopes, isAuthenticated } = useLoginStore();

  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return <Navigate to={'/auth/signin'} replace />;
  }

  // If 'ALL' is in feScopes, allow access regardless of requiredScopes
  if (feScopes.includes('ALL')) {
    return <Component />;
  }

  // If all checks pass, render the Component
  return <Component />;
};

export default RouteGuard;
