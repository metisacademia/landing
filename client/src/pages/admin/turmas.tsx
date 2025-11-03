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
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Turma, Moderador } from "@shared/schema";

const salas = ["Memória", "Linguagem", "Planejamento", "Mentalização", "Contemplação"];
const turnos = ["manhã", "tarde"];

const turmaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sala: z.string().min(1, "Sala é obrigatória"),
  turno: z.string().min(1, "Turno é obrigatório"),
  horario: z.string().min(1, "Horário é obrigatório"),
  moderadorId: z.string().optional(),
  capacidadeTotal: z.coerce.number().min(1, "Capacidade deve ser no mínimo 1"),
  observacoes: z.string().optional(),
});

type TurmaForm = z.infer<typeof turmaSchema>;

interface TurmaWithCount extends Turma {
  alunosCount?: number;
}

export default function Turmas() {
  const { toast } = useToast();
  const [filterTurno, setFilterTurno] = useState("all");
  const [filterSala, setFilterSala] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: turmas, isLoading } = useQuery<TurmaWithCount[]>({
    queryKey: ["/api/admin/turmas"],
  });

  const { data: moderadores } = useQuery<Moderador[]>({
    queryKey: ["/api/admin/moderadores"],
  });

  const form = useForm<TurmaForm>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      nome: "",
      sala: "",
      turno: "",
      horario: "",
      moderadorId: "none",
      capacidadeTotal: 0,
      observacoes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TurmaForm) => {
      return await apiRequest("POST", "/api/admin/turmas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/turmas"] });
      toast({
        title: "Turma criada com sucesso",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar turma",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TurmaForm }) => {
      return await apiRequest("PUT", `/api/admin/turmas/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/turmas"] });
      toast({
        title: "Turma atualizada com sucesso",
      });
      setIsDialogOpen(false);
      setEditingTurma(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar turma",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/turmas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/turmas"] });
      toast({
        title: "Turma excluída com sucesso",
      });
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir turma",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TurmaForm) => {
    const formData = {
      ...data,
      capacidadeTotal: Number(data.capacidadeTotal),
      moderadorId: data.moderadorId === "none" ? undefined : data.moderadorId
    };
    if (editingTurma) {
      updateMutation.mutate({ id: editingTurma.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    form.reset({
      nome: turma.nome,
      sala: turma.sala,
      turno: turma.turno,
      horario: turma.horario,
      moderadorId: turma.moderadorId || "none",
      capacidadeTotal: turma.capacidadeTotal,
      observacoes: turma.observacoes || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTurma(null);
    form.reset();
  };

  const filteredTurmas = turmas?.filter((turma) => {
    if (filterTurno && filterTurno !== "all" && turma.turno !== filterTurno) return false;
    if (filterSala && filterSala !== "all" && turma.sala !== filterSala) return false;
    return true;
  });

  const getModerador = (id: string | null) => {
    if (!id) return "Sem moderador";
    return moderadores?.find((m) => m.id === id)?.nome || "Desconhecido";
  };

  return (
    <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#173b5a]">Turmas</h2>
              <p className="text-gray-600 mt-1">
                Gerencie as turmas do sistema
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
              <DialogTrigger asChild>
                <Button
                  data-testid="button-new-turma"
                  className="bg-[#173b5a] hover:bg-[#173b5a]/90"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Turma
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTurma ? "Editar Turma" : "Nova Turma"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados da turma
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome da turma" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sala"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sala</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma sala" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {salas.map((sala) => (
                                  <SelectItem key={sala} value={sala}>
                                    {sala}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="turno"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Turno</FormLabel>
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
                        name="horario"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="14:00-16:00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="moderadorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moderador</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um moderador" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">Sem moderador</SelectItem>
                                {moderadores?.map((mod) => (
                                  <SelectItem key={mod.id} value={mod.id}>
                                    {mod.nome}
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
                        name="capacidadeTotal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacidade Total</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações (opcional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Observações sobre a turma" rows={3} />
                          </FormControl>
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
                          : editingTurma
                          ? "Atualizar"
                          : "Criar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-4">
            <Select value={filterTurno} onValueChange={setFilterTurno}>
              <SelectTrigger className="w-48" data-testid="select-filter-turno">
                <SelectValue placeholder="Filtrar por turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os turnos</SelectItem>
                {turnos.map((turno) => (
                  <SelectItem key={turno} value={turno}>
                    {turno.charAt(0).toUpperCase() + turno.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSala} onValueChange={setFilterSala}>
              <SelectTrigger className="w-48" data-testid="select-filter-sala">
                <SelectValue placeholder="Filtrar por sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as salas</SelectItem>
                {salas.map((sala) => (
                  <SelectItem key={sala} value={sala}>
                    {sala}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {((filterTurno && filterTurno !== "all") || (filterSala && filterSala !== "all")) && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilterTurno("all");
                  setFilterSala("all");
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173b5a] mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando turmas...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Moderador</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTurmas && filteredTurmas.length > 0 ? (
                    filteredTurmas.map((turma) => (
                      <TableRow key={turma.id}>
                        <TableCell className="font-medium">{turma.nome}</TableCell>
                        <TableCell>{turma.sala}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {turma.turno.charAt(0).toUpperCase() + turma.turno.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{turma.horario}</TableCell>
                        <TableCell>{getModerador(turma.moderadorId)}</TableCell>
                        <TableCell>{turma.capacidadeTotal}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {turma.alunosCount || 0} / {turma.capacidadeTotal}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(turma)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingId(turma.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        Nenhuma turma encontrada
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
                Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.
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
