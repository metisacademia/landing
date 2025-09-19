import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, QrCode, FileText, CreditCard } from "lucide-react";

const plans = {
  mensal: { name: "Mensal", price: 1145, originalPrice: 1300 },
  trimestral: { name: "Trimestral", price: 990, originalPrice: 1090 },
  semestral: { name: "Semestral", price: 890, originalPrice: 990 },
  anual: { name: "Anual", price: 790, originalPrice: 890 }
};

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  idade: string;
  plano: string;
  horario: string;
  observacoes: string;
  termos: boolean;
  paymentMethod: string;
}

function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    idade: "",
    plano: new URLSearchParams(window.location.search).get('plan') || "semestral",
    horario: "",
    observacoes: "",
    termos: false,
    paymentMethod: "UNDEFINED"
  });

  const selectedPlan = plans[formData.plano as keyof typeof plans] || plans.semestral;

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    updateFormData('cpf', formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    updateFormData('telefone', formatted);
  };

  const submitPreRegistration = async () => {
    if (!isFormComplete) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/create-pre-registration", {
        ...formData,
        idade: parseInt(formData.idade),
        amount: selectedPlan.price,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '')
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentData(data);
        toast({
          title: "Pré-matrícula criada com sucesso!",
          description: "Agora escolha sua forma de pagamento abaixo.",
        });
      } else {
        throw new Error(data.message || 'Erro ao processar pré-matrícula');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro ao processar pré-matrícula",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.location.href = '/';
  };

  const isFormComplete = formData.nome && 
                       formData.email && 
                       formData.telefone && 
                       formData.cpf && 
                       formData.idade && 
                       formData.termos;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost"
          onClick={goBack}
          className="mb-8"
          data-testid="button-voltar"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o site
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="checkout-title">
            Pré-matrícula Métis
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete seus dados para garantir sua vaga
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="shadow-lg border-border" data-testid="form-card">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input 
                    id="nome" 
                    type="text"
                    value={formData.nome}
                    onChange={(e) => updateFormData('nome', e.target.value)}
                    required
                    data-testid="input-nome"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                  <Input 
                    id="telefone" 
                    type="tel"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(81) 99999-9999"
                    required
                    data-testid="input-telefone"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input 
                    id="cpf" 
                    type="text"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    required
                    data-testid="input-cpf"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="idade">Idade *</Label>
                <Input 
                  id="idade" 
                  type="number"
                  min="18"
                  value={formData.idade}
                  onChange={(e) => updateFormData('idade', e.target.value)}
                  required
                  data-testid="input-idade"
                />
              </div>

              <div>
                <Label htmlFor="plano">Selecione seu plano</Label>
                <Select 
                  value={formData.plano} 
                  onValueChange={(value) => updateFormData('plano', value)}
                >
                  <SelectTrigger data-testid="select-plano">
                    <SelectValue placeholder="Escolha um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal - R$ 1.145/mês</SelectItem>
                    <SelectItem value="trimestral">Trimestral - R$ 990/mês</SelectItem>
                    <SelectItem value="semestral">Semestral - R$ 890/mês</SelectItem>
                    <SelectItem value="anual">Anual - R$ 790/mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="horario">Preferência de horário</Label>
                <Select 
                  value={formData.horario} 
                  onValueChange={(value) => updateFormData('horario', value)}
                >
                  <SelectTrigger data-testid="select-horario">
                    <SelectValue placeholder="Selecione uma preferência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã (8h às 12h)</SelectItem>
                    <SelectItem value="tarde">Tarde (14h às 18h)</SelectItem>
                    <SelectItem value="noite">Noite (18h às 21h)</SelectItem>
                    <SelectItem value="flexivel">Flexível</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea 
                  id="observacoes"
                  rows={3}
                  placeholder="Conte-nos sobre seus objetivos ou necessidades específicas"
                  value={formData.observacoes}
                  onChange={(e) => updateFormData('observacoes', e.target.value)}
                  data-testid="textarea-observacoes"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="termos"
                  checked={formData.termos}
                  onCheckedChange={(checked) => updateFormData('termos', checked as boolean)}
                  required
                  data-testid="checkbox-termos"
                />
                <Label htmlFor="termos" className="text-sm">
                  Concordo com os <a href="#" className="text-primary hover:underline">termos de uso</a> e <a href="#" className="text-primary hover:underline">política de privacidade</a> *
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <div className="space-y-6">
            {/* Plan Summary */}
            <Card className="shadow-lg border-border" data-testid="plan-summary">
              <CardHeader>
                <CardTitle>Resumo do Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{selectedPlan.name}</span>
                    <div className="text-right">
                      <div className="text-sm line-through text-muted-foreground">
                        R$ {selectedPlan.originalPrice}
                      </div>
                      <div className="text-lg font-bold text-primary">
                        R$ {selectedPlan.price}/mês
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-4 bg-accent/10 rounded-lg">
                    <p className="text-accent font-medium">
                      Economia de R$ {selectedPlan.originalPrice - selectedPlan.price} por mês
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            {!paymentData ? (
              <Card className={`shadow-lg border-border ${!isFormComplete ? 'bg-muted/50' : ''}`} data-testid="payment-placeholder">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Finalizar Pré-matrícula</h3>
                    <p className="text-muted-foreground">
                      {!isFormComplete 
                        ? "Complete as informações pessoais para continuar" 
                        : "Clique no botão abaixo para gerar suas opções de pagamento"
                      }
                    </p>
                    <Button 
                      onClick={submitPreRegistration}
                      disabled={!isFormComplete || loading}
                      className="w-full bg-accent text-accent-foreground py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                      data-testid="button-gerar-pagamento"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full mr-2" />
                          Processando...
                        </div>
                      ) : (
                        "Gerar Opções de Pagamento"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-border" data-testid="payment-options">
                <CardHeader>
                  <CardTitle>Escolha sua forma de pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Pagamento seguro processado pelo Asaas
                  </div>
                  
                  {paymentData.pixQrCode && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <QrCode className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">PIX - Pagamento Instantâneo</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Escaneie o QR Code ou copie o código PIX para pagar
                      </p>
                      <Button 
                        onClick={() => window.open(paymentData.pixQrCode, '_blank')}
                        className="w-full"
                        data-testid="button-pix"
                      >
                        Abrir QR Code PIX
                      </Button>
                    </div>
                  )}
                  
                  {paymentData.bankSlipUrl && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Boleto Bancário</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pague até o vencimento em qualquer banco ou internet banking
                      </p>
                      <Button 
                        onClick={() => window.open(paymentData.bankSlipUrl, '_blank')}
                        variant="outline"
                        className="w-full"
                        data-testid="button-boleto"
                      >
                        Abrir Boleto
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-center mt-6 p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Após o pagamento, você receberá a confirmação por e-mail e WhatsApp. 
                      Nossa equipe entrará em contato para agendar sua aula experimental.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}