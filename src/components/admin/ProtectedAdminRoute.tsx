import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to admin login with return path
        navigate("/admin/login", { 
          replace: true,
          state: { from: location.pathname }
        });
      } else if (!isAdmin) {
        // Authenticated but not admin, redirect to admin login (will show access denied)
        navigate("/admin/login", { 
          replace: true,
          state: { accessDenied: true }
        });
      }
    }
  }, [user, isAdmin, loading, navigate, location.pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated AND is admin
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // Return null while redirecting (prevents flash of content)
  return null;
};