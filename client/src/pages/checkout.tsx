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

const FIXED_PRICE = 250;

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  idade: string;
  horario: string;
  diasPreferencia: string[];
  observacoes: string;
  termos: boolean;
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
    horario: "",
    diasPreferencia: [],
    observacoes: "",
    termos: false
  });

  // Fixed price for pre-registration

  const updateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
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
        plano: "Pré-matrícula",
        idade: parseInt(formData.idade),
        amount: FIXED_PRICE,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        diaPreferencia: formData.diasPreferencia.join(', ')
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
                <Label>Valor da Pré-matrícula</Label>
                <div className="p-4 bg-accent/10 border-2 border-accent/20 rounded-lg" data-testid="prematricula-valor">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      Pré-matrícula R$ 250
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Valor único para garantir sua vaga
                    </div>
                  </div>
                </div>
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
                <Label>Preferência de dias da semana</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { value: 'segunda', label: 'Segunda-feira' },
                    { value: 'terca', label: 'Terça-feira' },
                    { value: 'quarta', label: 'Quarta-feira' },
                    { value: 'quinta', label: 'Quinta-feira' },
                    { value: 'sexta', label: 'Sexta-feira' }
                  ].map((dia) => (
                    <div key={dia.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={dia.value}
                        checked={formData.diasPreferencia.includes(dia.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('diasPreferencia', [...formData.diasPreferencia, dia.value]);
                          } else {
                            updateFormData('diasPreferencia', formData.diasPreferencia.filter(d => d !== dia.value));
                          }
                        }}
                        data-testid={`checkbox-${dia.value}`}
                      />
                      <Label htmlFor={dia.value} className="text-sm font-normal cursor-pointer">
                        {dia.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Selecione os dias de sua preferência
                </p>
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
                <CardTitle>Resumo da Pré-matrícula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Pré-matrícula Métis</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        R$ {FIXED_PRICE}
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-4 bg-accent/10 rounded-lg">
                    <p className="text-accent font-medium">
                      ✨ Academia da Mente - Circuito Cognitivo
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      4 salas especializadas • Grupos de até 6 pessoas
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
                  
                  {/* PIX Payment Option */}
                  {paymentData.paymentOptions?.pix?.qrCode && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <QrCode className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">PIX - Pagamento Instantâneo</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Escaneie o QR Code ou copie o código PIX para pagar
                      </p>
                      <Button 
                        onClick={() => window.open(paymentData.paymentOptions.pix.qrCode, '_blank')}
                        className="w-full"
                        data-testid="button-pix"
                      >
                        Abrir QR Code PIX
                      </Button>
                    </div>
                  )}
                  
                  {/* Boleto Payment Option */}
                  {paymentData.paymentOptions?.boleto?.bankSlipUrl && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Boleto Bancário</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pague até o vencimento em qualquer banco ou internet banking
                      </p>
                      <Button 
                        onClick={() => window.open(paymentData.paymentOptions.boleto.bankSlipUrl, '_blank')}
                        variant="outline"
                        className="w-full"
                        data-testid="button-boleto"
                      >
                        Abrir Boleto
                      </Button>
                    </div>
                  )}

                  {/* Credit Card Payment Option */}
                  {paymentData.paymentOptions?.creditCard?.url && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Cartão de Crédito</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pague com cartão de crédito em até 12x
                      </p>
                      <Button 
                        onClick={() => window.open(paymentData.paymentOptions.creditCard.url, '_blank')}
                        variant="secondary"
                        className="w-full"
                        data-testid="button-credit-card"
                      >
                        Pagar com Cartão
                      </Button>
                    </div>
                  )}

                  {/* Legacy support for old API response */}
                  {!paymentData.paymentOptions && paymentData.pixQrCode && (
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
                  
                  {!paymentData.paymentOptions && paymentData.bankSlipUrl && (
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