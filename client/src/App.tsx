import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SeoHead from "@/components/seo-head";
import Home from "@/pages/home";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import ComoFuncionaPage from "@/pages/como-funciona";
import SalaPage from "@/pages/sala";
import PlanosPage from "@/pages/planos";
import AulaExperimentalPage from "@/pages/aula-experimental";
import ContatoPage from "@/pages/contato";
import PerguntasFrequentesPage from "@/pages/perguntas-frequentes";
import TreinoCognitivoRecifePage from "@/pages/treino-cognitivo-recife";
import ParaMedicosPage from "@/pages/para-medicos";
import EquipePage from "@/pages/equipe";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import Moderadores from "@/pages/admin/moderadores";
import Turmas from "@/pages/admin/turmas";
import Alunos from "@/pages/admin/alunos";
import ProtectedRoute from "@/components/admin/protected-route";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/como-funciona" component={ComoFuncionaPage} />
      <Route path="/salas/:slug" component={SalaPage} />
      <Route path="/planos" component={PlanosPage} />
      <Route path="/aula-experimental" component={AulaExperimentalPage} />
      <Route path="/contato" component={ContatoPage} />
      <Route path="/perguntas-frequentes" component={PerguntasFrequentesPage} />
      <Route path="/treino-cognitivo-em-recife" component={TreinoCognitivoRecifePage} />
      <Route path="/para-medicos" component={ParaMedicosPage} />
      <Route path="/equipe" component={EquipePage} />
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

type AppProps = {
  ssrPath?: string;
};

function App({ ssrPath }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router {...(ssrPath ? { ssrPath } : {})}>
          <SeoHead />
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
