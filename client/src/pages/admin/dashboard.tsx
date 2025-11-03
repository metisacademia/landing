import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, UserCircle, TrendingUp } from "lucide-react";

interface Stats {
  totalModeradores: number;
  totalTurmas: number;
  totalAlunos: number;
  taxaOcupacao: number;
  turmasPorSala: {
    sala: string;
    count: number;
  }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-[#173b5a]">Dashboard</h2>
            <p className="text-gray-600 mt-1">
              Visão geral do sistema Métis
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173b5a] mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando estatísticas...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card data-testid="card-moderadores" className="border-l-4 border-l-[#173b5a]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Moderadores
                    </CardTitle>
                    <Users className="h-5 w-5 text-[#173b5a]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#173b5a]">
                      {stats?.totalModeradores ?? 0}
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-turmas" className="border-l-4 border-l-[#cda465]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Turmas
                    </CardTitle>
                    <GraduationCap className="h-5 w-5 text-[#cda465]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#cda465]">
                      {stats?.totalTurmas ?? 0}
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-alunos" className="border-l-4 border-l-[#173b5a]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Alunos
                    </CardTitle>
                    <UserCircle className="h-5 w-5 text-[#173b5a]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#173b5a]">
                      {stats?.totalAlunos ?? 0}
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-ocupacao" className="border-l-4 border-l-[#cda465]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taxa de Ocupação
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-[#cda465]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#cda465]">
                      {stats?.taxaOcupacao?.toFixed(1) ?? 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#173b5a]">Turmas por Sala</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.turmasPorSala?.map((item) => (
                      <div key={item.sala} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{item.sala}</span>
                          <span className="text-[#173b5a] font-semibold">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#cda465] h-2.5 rounded-full"
                            style={{
                              width: `${stats.turmasPorSala.length > 0 ? (item.count / Math.max(...stats.turmasPorSala.map(s => s.count))) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {(!stats?.turmasPorSala || stats.turmasPorSala.length === 0) && (
                      <p className="text-center text-gray-500 py-8">
                        Nenhuma turma cadastrada ainda
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AdminLayout>
  );
}
