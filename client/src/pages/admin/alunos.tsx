import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Download, Search } from "lucide-react";
import type { Aluno, Turma } from "@shared/schema";

const turnos = ["manhã", "tarde"];

const alunoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  idade: z.coerce.number().min(1, "Idade deve ser positiva"),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  email: z.string().email("E-mail inválido"),
  turnoPreferido: z.string().min(1, "Turno preferido é obrigatório"),
  turmaId: z.string().optional(),
});

type AlunoForm = z.infer<typeof alunoSchema>;

interface TurmaWithCount extends Turma {
  alunosCount?: number;
}

export default function Alunos() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: alunos, isLoading } = useQuery<Aluno[]>({
    queryKey: searchTerm
      ? ["/api/admin/alunos/search", searchTerm]
      : ["/api/admin/alunos"],
    queryFn: searchTerm
      ? async () => {
          const response = await fetch(`/api/admin/alunos/search?q=${encodeURIComponent(searchTerm)}`);
          if (!response.ok) throw new Error('Failed to search');
          return response.json();
        }
      : undefined,
  });

  const { data: turmas } = useQuery<TurmaWithCount[]>({
    queryKey: ["/api/admin/turmas"],
  });

  const form = useForm<AlunoForm>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      nome: "",
      idade: 0,
      telefone: "",
      email: "",
      turnoPreferido: "",
      turmaId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AlunoForm) => {
      return await apiRequest("POST", "/api/admin/alunos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/alunos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/turmas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Aluno criado com sucesso",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AlunoForm }) => {
      return await apiRequest("PUT", `/api/admin/alunos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/alunos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/turmas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Aluno atualizado com sucesso",
      });
      setIsDialogOpen(false);
      setEditingAluno(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/alunos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/alunos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/turmas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Aluno excluído com sucesso",
      });
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AlunoForm) => {
    const formData = {
      ...data,
      idade: Number(data.idade)
    };
    if (editingAluno) {
      updateMutation.mutate({ id: editingAluno.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    form.reset({
      nome: aluno.nome,
      idade: aluno.idade,
      telefone: aluno.telefone,
      email: aluno.email,
      turnoPreferido: aluno.turnoPreferido,
      turmaId: aluno.turmaId || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAluno(null);
    form.reset();
  };

  const getTurma = (id: string | null) => {
    if (!id) return "Sem turma";
    return turmas?.find((t) => t.id === id)?.nome || "Desconhecida";
  };

  const isTurmaCheia = (turmaId: string | null) => {
    if (!turmaId) return false;
    const turma = turmas?.find((t) => t.id === turmaId);
    if (!turma) return false;
    return (turma.alunosCount || 0) >= turma.capacidadeTotal;
  };

  const exportToCSV = () => {
    if (!alunos || alunos.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Nome", "Idade", "Telefone", "Email", "Turno Preferido", "Turma"];
    const rows = alunos.map((a) => [
      a.nome,
      a.idade.toString(),
      a.telefone,
      a.email,
      a.turnoPreferido,
      getTurma(a.turmaId),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `alunos-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Arquivo exportado com sucesso",
    });
  };

  return (
    <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#173b5a]">Alunos</h2>
              <p className="text-gray-600 mt-1">
                Gerencie os alunos do sistema
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                data-testid="button-export-csv-alunos"
                disabled={!alunos || alunos.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                  <Button
                    data-testid="button-new-aluno"
                    className="bg-[#173b5a] hover:bg-[#173b5a]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Aluno
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingAluno ? "Editar Aluno" : "Novo Aluno"}
                    </DialogTitle>
                    <DialogDescription>
                      Preencha os dados do aluno
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome completo" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="idade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Idade</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" min="1" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="(00) 00000-0000" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="email@exemplo.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="turnoPreferido"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Turno Preferido</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o turno" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {turnos.map((turno) => (
                                  <SelectItem key={turno} value={turno}>
                                    {turno.charAt(0).toUpperCase() + turno.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="turmaId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Turma (opcional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma turma" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">Sem turma</SelectItem>
                                {turmas?.map((turma) => {
                                  const cheia = (turma.alunosCount || 0) >= turma.capacidadeTotal;
                                  return (
                                    <SelectItem
                                      key={turma.id}
                                      value={turma.id}
                                      disabled={cheia}
                                    >
                                      {turma.nome} - {turma.sala} ({turma.alunosCount || 0}/{turma.capacidadeTotal})
                                      {cheia && " - CHEIA"}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseDialog}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#173b5a] hover:bg-[#173b5a]/90"
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          {createMutation.isPending || updateMutation.isPending
                            ? "Salvando..."
                            : editingAluno
                            ? "Atualizar"
                            : "Criar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                data-testid="input-search-aluno"
                placeholder="Buscar aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173b5a] mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando alunos...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Turno Preferido</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunos && alunos.length > 0 ? (
                    alunos.map((aluno) => (
                      <TableRow key={aluno.id}>
                        <TableCell className="font-medium">{aluno.nome}</TableCell>
                        <TableCell>{aluno.idade}</TableCell>
                        <TableCell>{aluno.telefone}</TableCell>
                        <TableCell>{aluno.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {aluno.turnoPreferido.charAt(0).toUpperCase() + aluno.turnoPreferido.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{getTurma(aluno.turmaId)}</span>
                            {aluno.turmaId && isTurmaCheia(aluno.turmaId) && (
                              <Badge variant="destructive" className="text-xs">
                                Cheia
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(aluno)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingId(aluno.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        Nenhum aluno encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingId && deleteMutation.mutate(deletingId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
  );
}
