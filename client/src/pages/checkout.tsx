import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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
import { ArrowLeft, Lock } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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
  idade: string;
  plano: string;
  horario: string;
  observacoes: string;
  termos: boolean;
}

const CheckoutForm = ({ formData }: { formData: FormData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      toast({
        title: "Erro no pagamento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Sua pré-matrícula foi confirmada. Entraremos em contato em breve.",
      });
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-input rounded-lg bg-muted/10">
        <Label className="block text-sm font-medium text-foreground mb-2">
          Informações do cartão
        </Label>
        <div id="card-element" className="p-3 bg-background border border-input rounded">
          <PaymentElement />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-accent text-accent-foreground py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        data-testid="button-finalizar-pagamento"
      >
        {processing ? (
          <div className="flex items-center">
            <div className="animate-spin w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full mr-2" />
            Processando...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Lock className="h-5 w-5 mr-2" />
            Finalizar Pré-matrícula
          </div>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Lock className="h-4 w-4 inline mr-1" />
        Pagamento seguro processado pelo Stripe. Seus dados estão protegidos.
      </p>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    idade: "",
    plano: new URLSearchParams(window.location.search).get('plan') || "semestral",
    horario: "",
    observacoes: "",
    termos: false
  });

  const selectedPlan = plans[formData.plano as keyof typeof plans] || plans.semestral;

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (formData.nome && formData.email && formData.telefone && formData.idade && formData.termos) {
      createPreRegistration();
    }
  }, [formData]);

  const createPreRegistration = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-pre-registration", {
        ...formData,
        idade: parseInt(formData.idade),
        amount: selectedPlan.price
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Erro ao processar pré-matrícula",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const goBack = () => {
    window.location.href = '/';
  };

  const isFormComplete = formData.nome && formData.email && formData.telefone && formData.idade && formData.termos;

  if (loading && isFormComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Preparando seu pagamento...</p>
        </div>
      </div>
    );
  }

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
                  <Label htmlFor="nome">Nome Completo</Label>
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
                  <Label htmlFor="email">E-mail</Label>
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
                  <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                  <Input 
                    id="telefone" 
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => updateFormData('telefone', e.target.value)}
                    required
                    data-testid="input-telefone"
                  />
                </div>
                <div>
                  <Label htmlFor="idade">Idade</Label>
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
                  Concordo com os <a href="#" className="text-primary hover:underline">termos de uso</a> e <a href="#" className="text-primary hover:underline">política de privacidade</a>
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

            {/* Payment Form */}
            {isFormComplete && clientSecret && (
              <Card className="shadow-lg border-border" data-testid="payment-form">
                <CardHeader>
                  <CardTitle>Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm formData={formData} />
                  </Elements>
                </CardContent>
              </Card>
            )}

            {!isFormComplete && (
              <Card className="shadow-lg border-border bg-muted/50" data-testid="payment-placeholder">
                <CardContent className="p-8 text-center">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Complete as informações pessoais para continuar com o pagamento
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
