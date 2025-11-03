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
import { Plus, Pencil, Trash2, Download, Search } from "lucide-react";
import type { Moderador } from "@shared/schema";

const salas = ["Memória", "Linguagem", "Planejamento", "Mentalização", "Contemplação", "Circuito Completo"];

const moderadorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  salaPrincipal: z.string().min(1, "Sala principal é obrigatória"),
  cargaHorariaSemanal: z.coerce.number().min(1, "Carga horária deve ser positiva"),
});

type ModeradorForm = z.infer<typeof moderadorSchema>;

export default function Moderadores() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModerador, setEditingModerador] = useState<Moderador | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: moderadores, isLoading } = useQuery<Moderador[]>({
    queryKey: searchTerm
      ? ["/api/admin/moderadores/search", searchTerm]
      : ["/api/admin/moderadores"],
    queryFn: searchTerm
      ? async () => {
          const response = await fetch(`/api/admin/moderadores/search?q=${encodeURIComponent(searchTerm)}`);
          if (!response.ok) throw new Error('Failed to search');
          return response.json();
        }
      : undefined,
  });

  const form = useForm<ModeradorForm>({
    resolver: zodResolver(moderadorSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      salaPrincipal: "",
      cargaHorariaSemanal: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ModeradorForm) => {
      return await apiRequest("POST", "/api/admin/moderadores", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/moderadores"] });
      toast({
        title: "Moderador criado com sucesso",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar moderador",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ModeradorForm }) => {
      return await apiRequest("PUT", `/api/admin/moderadores/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/moderadores"] });
      toast({
        title: "Moderador atualizado com sucesso",
      });
      setIsDialogOpen(false);
      setEditingModerador(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar moderador",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/moderadores/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/moderadores"] });
      toast({
        title: "Moderador excluído com sucesso",
      });
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir moderador",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ModeradorForm) => {
    const formData = {
      ...data,
      cargaHorariaSemanal: Number(data.cargaHorariaSemanal)
    };
    if (editingModerador) {
      updateMutation.mutate({ id: editingModerador.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (moderador: Moderador) => {
    setEditingModerador(moderador);
    form.reset({
      nome: moderador.nome,
      email: moderador.email,
      telefone: moderador.telefone,
      salaPrincipal: moderador.salaPrincipal,
      cargaHorariaSemanal: moderador.cargaHorariaSemanal,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingModerador(null);
    form.reset();
  };

  const exportToCSV = () => {
    if (!moderadores || moderadores.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Nome", "Email", "Telefone", "Sala Principal", "Carga Horária"];
    const rows = moderadores.map((m) => [
      m.nome,
      m.email,
      m.telefone,
      m.salaPrincipal,
      m.cargaHorariaSemanal.toString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `moderadores-${new Date().toISOString().split("T")[0]}.csv`);
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
              <h2 className="text-3xl font-bold text-[#173b5a]">Moderadores</h2>
              <p className="text-gray-600 mt-1">
                Gerencie os moderadores do sistema
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                data-testid="button-export-csv"
                disabled={!moderadores || moderadores.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button
                data-testid="button-new-moderador"
                className="bg-[#173b5a] hover:bg-[#173b5a]/90"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Moderador
              </Button>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingModerador ? "Editar Moderador" : "Novo Moderador"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do moderador
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
                  <FormField
                    control={form.control}
                    name="salaPrincipal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sala Principal</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="cargaHorariaSemanal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carga Horária Semanal (horas)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" />
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
                        : editingModerador
                        ? "Atualizar"
                        : "Criar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                data-testid="input-search-moderador"
                placeholder="Buscar moderador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173b5a] mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando moderadores...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Sala Principal</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moderadores && moderadores.length > 0 ? (
                    moderadores.map((moderador) => (
                      <TableRow key={moderador.id}>
                        <TableCell className="font-medium">{moderador.nome}</TableCell>
                        <TableCell>{moderador.email}</TableCell>
                        <TableCell>{moderador.telefone}</TableCell>
                        <TableCell>{moderador.salaPrincipal}</TableCell>
                        <TableCell>{moderador.cargaHorariaSemanal}h/semana</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(moderador)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingId(moderador.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        Nenhum moderador encontrado
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
                Tem certeza que deseja excluir este moderador? Esta ação não pode ser desfeita.
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
