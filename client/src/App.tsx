import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import Moderadores from "@/pages/admin/moderadores";
import Turmas from "@/pages/admin/turmas";
import Alunos from "@/pages/admin/alunos";
import ProtectedRoute from "@/components/admin/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        {() => (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/moderadores">
        {() => (
          <ProtectedRoute>
            <Moderadores />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/turmas">
        {() => (
          <ProtectedRoute>
            <Turmas />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/alunos">
        {() => (
          <ProtectedRoute>
            <Alunos />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
