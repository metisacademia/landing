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
import { ArrowLeft, Copy, FileText, CreditCard } from "lucide-react";

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
  // Campos de endereço obrigatórios para nota fiscal
  postalCode: string;
  addressNumber: string;
  complement: string;
  // Campos preenchidos automaticamente pelo ViaCEP
  address: string;
  city: string;
  province: string;
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

function formatCEP(cep: string): string {
  const numbers = cep.replace(/\D/g, '');
  if (numbers.length <= 8) {
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  return numbers.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [preRegistrationId, setPreRegistrationId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState<{ [key: string]: boolean }>({});
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
    termos: false,
    // Campos de endereço
    postalCode: "",
    addressNumber: "",
    complement: "",
    address: "",
    city: "",
    province: ""
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

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    updateFormData('postalCode', formatted);

    // Auto-buscar endereço quando CEP completo (8 dígitos)
    const numbers = formatted.replace(/\D/g, '');
    if (numbers.length === 8) {
      await fetchAddressByCEP(numbers);
    } else {
      // Limpar campos de endereço se CEP incompleto
      updateFormData('address', '');
      updateFormData('city', '');
      updateFormData('province', '');
    }
  };

  const fetchAddressByCEP = async (cep: string) => {
    try {
      console.log('🔍 [ViaCEP] Buscando endereço para CEP:', cep);
      
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto.",
          variant: "destructive",
        });
        return;
      }

      // Preencher automaticamente os campos de endereço
      updateFormData('address', data.logradouro);
      updateFormData('city', data.localidade);
      updateFormData('province', data.bairro);

      console.log('✅ [ViaCEP] Endereço encontrado:', {
        logradouro: data.logradouro,
        cidade: data.localidade,
        bairro: data.bairro
      });

      toast({
        title: "Endereço encontrado!",
        description: `${data.logradouro}, ${data.bairro} - ${data.localidade}`,
      });
    } catch (error) {
      console.error('❌ [ViaCEP] Erro ao buscar endereço:', error);
      toast({
        title: "Erro ao buscar endereço",
        description: "Tente novamente ou digite o endereço manualmente.",
        variant: "destructive",
      });
    }
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
        setPreRegistrationId(data.preRegistrationId);
        toast({
          title: "Pré-matrícula criada com sucesso!",
          description: data.message,
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

  const createPayment = async (paymentType: 'pix' | 'boleto' | 'creditcard') => {
    if (!preRegistrationId) return;

    setPaymentLoading({ ...paymentLoading, [paymentType]: true });
    
    try {
      let endpoint = '';
      switch (paymentType) {
        case 'pix':
          endpoint = `/api/create-pix-payment/${preRegistrationId}`;
          break;
        case 'boleto':
          endpoint = `/api/create-boleto-payment/${preRegistrationId}`;
          break;
        case 'creditcard':
          endpoint = `/api/create-creditcard-payment/${preRegistrationId}`;
          break;
      }

      const response = await apiRequest("POST", endpoint, {});
      const data = await response.json();
      
      if (data.success) {
        setPaymentData(data);
        toast({
          title: "Pagamento criado com sucesso!",
          description: `Pagamento via ${data.paymentType} foi gerado.`,
        });
      } else {
        throw new Error(data.message || 'Erro ao criar pagamento');
      }
    } catch (error: any) {
      console.error(`Error creating ${paymentType} payment:`, error);
      toast({
        title: "Erro ao criar pagamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPaymentLoading({ ...paymentLoading, [paymentType]: false });
    }
  };

  const goBack = () => {
    window.location.href = '/';
  };

  const copyPixCode = async (pixCode: string) => {
    try {
      await navigator.clipboard.writeText(pixCode);
      toast({
        title: "Código PIX copiado!",
        description: "Cole no seu banco ou app de pagamento",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente o código abaixo",
        variant: "destructive",
      });
    }
  };

  const isFormComplete = formData.nome && 
                       formData.email && 
                       formData.telefone && 
                       formData.cpf && 
                       formData.idade && 
                       formData.postalCode && 
                       formData.addressNumber && 
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

              {/* Seção de Endereço */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">📍 Endereço para Nota Fiscal</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Necessário para emissão automática da nota fiscal após o pagamento
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="postalCode">CEP *</Label>
                    <Input 
                      id="postalCode" 
                      type="text"
                      value={formData.postalCode}
                      onChange={handleCEPChange}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                      data-testid="input-cep"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Digite o CEP para buscar o endereço automaticamente
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="addressNumber">Número *</Label>
                    <Input 
                      id="addressNumber" 
                      type="text"
                      value={formData.addressNumber}
                      onChange={(e) => updateFormData('addressNumber', e.target.value)}
                      placeholder="123"
                      required
                      data-testid="input-numero"
                    />
                  </div>
                </div>

                {/* Campos preenchidos automaticamente pelo ViaCEP */}
                {formData.address && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-green-800">Endereço encontrado automaticamente</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-green-700">Logradouro:</label>
                        <p className="text-green-800">{formData.address}</p>
                      </div>
                      <div>
                        <label className="font-medium text-green-700">Bairro:</label>
                        <p className="text-green-800">{formData.province}</p>
                      </div>
                      <div>
                        <label className="font-medium text-green-700">Cidade:</label>
                        <p className="text-green-800">{formData.city}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="complement">Complemento (opcional)</Label>
                  <Input 
                    id="complement" 
                    type="text"
                    value={formData.complement}
                    onChange={(e) => updateFormData('complement', e.target.value)}
                    placeholder="Apartamento, bloco, sala..."
                    data-testid="input-complemento"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ex: Apto 101, Bloco B, Sala 205
                  </p>
                </div>
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
            {!preRegistrationId ? (
              <Card className={`shadow-lg border-border ${!isFormComplete ? 'bg-muted/50' : ''}`} data-testid="payment-placeholder">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Finalizar Pré-matrícula</h3>
                    <p className="text-muted-foreground">
                      {!isFormComplete 
                        ? "Complete as informações pessoais para continuar" 
                        : "Clique no botão abaixo para criar sua pré-matrícula"
                      }
                    </p>
                    <Button 
                      onClick={submitPreRegistration}
                      disabled={!isFormComplete || loading}
                      className="w-full bg-accent text-accent-foreground py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                      data-testid="button-criar-prematricula"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full mr-2" />
                          Processando...
                        </div>
                      ) : (
                        "Criar Pré-matrícula"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : !paymentData ? (
              <Card className="shadow-lg border-border" data-testid="payment-methods">
                <CardHeader>
                  <CardTitle>Escolha sua forma de pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Pagamento seguro processado pelo Asaas • Selecione abaixo para gerar sua cobrança
                  </div>
                  
                  {/* PIX Payment Button */}
                  <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Copy className="h-6 w-6 mr-3 text-primary" />
                        <div>
                          <div className="font-medium">PIX</div>
                          <div className="text-sm text-muted-foreground">Pagamento instantâneo</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => createPayment('pix')}
                        disabled={paymentLoading.pix}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        data-testid="button-pix"
                      >
                        {paymentLoading.pix ? (
                          <div className="flex items-center">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Gerando...
                          </div>
                        ) : (
                          "Pagar com PIX"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Boleto Payment Button */}
                  <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 mr-3 text-primary" />
                        <div>
                          <div className="font-medium">Boleto Bancário</div>
                          <div className="text-sm text-muted-foreground">Vencimento em 7 dias</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => createPayment('boleto')}
                        disabled={paymentLoading.boleto}
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        data-testid="button-boleto"
                      >
                        {paymentLoading.boleto ? (
                          <div className="flex items-center">
                            <div className="animate-spin w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full mr-2" />
                            Gerando...
                          </div>
                        ) : (
                          "Gerar Boleto"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Credit Card Payment Button */}
                  <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 mr-3 text-primary" />
                        <div>
                          <div className="font-medium">Cartão de Crédito</div>
                          <div className="text-sm text-muted-foreground">Parcelamento até 12x</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => createPayment('creditcard')}
                        disabled={paymentLoading.creditcard}
                        variant="secondary"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        data-testid="button-credit-card"
                      >
                        {paymentLoading.creditcard ? (
                          <div className="flex items-center">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Gerando...
                          </div>
                        ) : (
                          "Pagar com Cartão"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-center mt-6 p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      ⚡ Nova otimização: Gere apenas a cobrança do método que deseja usar.<br/>
                      Isso mantém o sistema organizado e facilita o controle administrativo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-border" data-testid="payment-options">
                <CardHeader>
                  <CardTitle>✅ Pagamento Gerado - {paymentData.paymentType}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Pagamento seguro processado pelo Asaas • ID: {paymentData.paymentId}
                  </div>
                  
                  {/* PIX Payment Option */}
                  {paymentData.paymentType === 'PIX' && paymentData.qrCode && (
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center mb-2">
                        <Copy className="h-5 w-5 mr-2 text-green-600" />
                        <span className="font-medium text-green-800">PIX Copia e Cola</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Copie o código PIX abaixo e cole no seu banco ou app de pagamento
                      </p>
                      <div className="bg-white p-3 rounded-md mb-3 border">
                        <p className="text-xs text-muted-foreground mb-1">Código PIX:</p>
                        <p className="text-sm font-mono break-all">{paymentData.qrCode}</p>
                      </div>
                      <Button 
                        onClick={() => copyPixCode(paymentData.qrCode)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        data-testid="button-copy-pix"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar código PIX
                      </Button>
                    </div>
                  )}
                  
                  {/* Boleto Payment Option */}
                  {paymentData.paymentType === 'BOLETO' && paymentData.bankSlipUrl && (
                    <div className="border rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 mr-2 text-orange-600" />
                        <span className="font-medium text-orange-800">Boleto Bancário</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pague até o vencimento em qualquer banco ou internet banking
                      </p>
                      <Button 
                        onClick={() => window.open(paymentData.bankSlipUrl, '_blank')}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        data-testid="button-open-boleto"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Abrir Boleto
                      </Button>
                    </div>
                  )}

                  {/* Credit Card Payment Option */}
                  {paymentData.paymentType === 'CREDIT_CARD' && paymentData.url && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center mb-2">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium text-blue-800">Cartão de Crédito</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pague com cartão de crédito em até 12x
                      </p>
                      <Button 
                        onClick={() => window.open(paymentData.url, '_blank')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        data-testid="button-pay-credit-card"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagar com Cartão
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-center mt-6 p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Após o pagamento, você receberá a confirmação por e-mail e WhatsApp. 
                      Nossa equipe entrará em contato para agendar sua aula experimental.
                    </p>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={() => setPaymentData(null)}
                      variant="outline"
                      size="sm"
                      data-testid="button-generate-another"
                    >
                      Gerar outro método de pagamento
                    </Button>
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