import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/moderadores", label: "Moderadores", icon: Users },
  { path: "/admin/turmas", label: "Turmas", icon: GraduationCap },
  { path: "/admin/alunos", label: "Alunos", icon: UserCircle },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: async () => {
      localStorage.removeItem("admin_token");
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/check-auth'] });
      await queryClient.clear();
      toast({
        title: "Logout realizado com sucesso",
      });
      setLocation("/admin/login");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f1e7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <img
              src="/images/logo-metis.jpg"
              alt="Métis"
              className="h-10 object-contain"
            />
            <h1 className="text-xl font-semibold text-[#173b5a] hidden sm:block">
              Dashboard Administrativo
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-[#173b5a] hover:text-[#173b5a]/80"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-[57px] left-0 z-30 h-[calc(100vh-57px)] w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-[#173b5a] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
