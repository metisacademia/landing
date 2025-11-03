import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ReactNode, useEffect } from "react";

interface AuthResponse {
  isAuthenticated: boolean;
}

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<AuthResponse>({
    queryKey: ["/api/admin/check-auth"],
  });

  useEffect(() => {
    if (!isLoading && !data?.isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [data, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f1e7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173b5a] mx-auto mb-4"></div>
          <p className="text-[#173b5a]">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!data?.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
