import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Brain, Check, Gift, Clock, Shield } from "lucide-react";

// Declaração do dataLayer e função UTM para TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    getMetisUTM: () => Record<string, string>;
  }
}

const leadFormSchema = z.object({
  name: z.string().min(3, "Por favor, informe seu nome completo"),
  phone: z.string().min(10, "Por favor, informe um telefone válido"),
  source: z.string().min(1, "Por favor, selecione uma opção"),
  // Campos UTM (opcionais, preenchidos automaticamente)
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  origem: z.string().optional(),
  landing_url: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function LeadFormSection() {
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      source: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      origem: "",
      landing_url: "",
    },
  });

  // Preenche campos UTM automaticamente ao carregar
  useEffect(() => {
    if (typeof window !== 'undefined' && window.getMetisUTM) {
      const utmData = window.getMetisUTM();
      if (utmData.utm_source) form.setValue('utm_source', utmData.utm_source);
      if (utmData.utm_medium) form.setValue('utm_medium', utmData.utm_medium);
      if (utmData.utm_campaign) form.setValue('utm_campaign', utmData.utm_campaign);
      if (utmData.origem) form.setValue('origem', utmData.origem);
      if (utmData.landing_url) form.setValue('landing_url', utmData.landing_url);
    }
  }, [form]);

  const sourceOptions = [
    "Indicação médica",
    "Indicação de amigo/familiar",
    "Redes sociais",
    "Busca no Google",
  ];

  const benefits = [
    { icon: Gift, text: "Aula experimental gratuita" },
    { icon: Clock, text: "Respondemos em até 24h" },
    { icon: Shield, text: "Sem compromisso" },
  ];

  const onSubmit = (data: LeadFormData) => {
    // Evento de rastreamento para GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'form_submit',
      'form_type': 'contato',
      'utm_source': data.utm_source || '',
      'utm_medium': data.utm_medium || '',
      'utm_campaign': data.utm_campaign || '',
      'origem': data.origem || '',
    });

    // Monta mensagem para WhatsApp (inclui UTMs para rastreamento interno)
    let message = `Olá! Meu nome é ${data.name} e gostaria de agendar uma aula experimental. Meu telefone: ${data.phone}. Conheci a Métis por: ${data.source}`;

    // Adiciona UTMs se disponíveis (para controle interno)
    if (data.utm_source || data.utm_campaign) {
      message += ` [UTM: ${data.utm_source || 'direto'}/${data.utm_medium || '-'}/${data.utm_campaign || '-'}]`;
    }

    const whatsappUrl = `https://wa.me/5581992726495?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    toast({
      title: "Redirecionando para o WhatsApp",
      description: "Complete o agendamento pelo WhatsApp.",
    });

    form.reset();
  };

  return (
    <section id="formulario" className="section-padding bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#c9a961]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0f2940]/5 rounded-full blur-3xl" />

      <div className="container-elegant relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Lado esquerdo - Conteúdo */}
            <motion.div variants={itemVariants}>
              {/* Badge */}
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-[#c9a961]/15 text-[#c9a961] mb-6"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              >
                <Brain className="w-4 h-4" />
                Primeiro passo
              </span>

              {/* Título emocional */}
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#0f2940] mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Dê o primeiro passo para uma{" "}
                <span className="relative">
                  <span className="relative z-10">mente mais ativa</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#c9a961]/20 -z-0" />
                </span>
              </h2>

              <p
                className="text-lg text-[#4a5568] mb-8 leading-relaxed"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              >
                Agende sua aula experimental gratuita e conheça nossa metodologia exclusiva desenvolvida por neurologistas.
              </p>

              {/* Benefícios */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    variants={itemVariants}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0f2940]/5 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-[#0f2940]" />
                    </div>
                    <span
                      className="text-[#4a5568] font-medium"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Lado direito - Formulário */}
            <motion.div variants={itemVariants}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-[#0f2940]/5"
                >
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-sm font-medium text-[#0f2940]"
                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            Nome completo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Como devemos chamá-lo?"
                              className="w-full px-5 py-4 text-base rounded-xl border-[#0f2940]/10 focus:border-[#c9a961] focus:ring-[#c9a961]/20 transition-all"
                              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-sm font-medium text-[#0f2940]"
                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            WhatsApp
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(81) 99999-9999"
                              className="w-full px-5 py-4 text-base rounded-xl border-[#0f2940]/10 focus:border-[#c9a961] focus:ring-[#c9a961]/20 transition-all"
                              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-sm font-medium text-[#0f2940]"
                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            Como conheceu a Métis?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
                            >
                              {sourceOptions.map((opt) => (
                                <div
                                  key={opt}
                                  className="flex items-center space-x-2 p-3 rounded-xl border border-[#0f2940]/10 hover:border-[#c9a961]/50 transition-colors cursor-pointer"
                                >
                                  <RadioGroupItem
                                    value={opt}
                                    id={opt}
                                    className="border-[#0f2940]/20 text-[#c9a961]"
                                  />
                                  <label
                                    htmlFor={opt}
                                    className="text-sm text-[#4a5568] cursor-pointer"
                                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                  >
                                    {opt}
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full py-6 rounded-xl text-base font-semibold bg-gradient-to-r from-[#c9a961] to-[#b89a52] text-[#0f2940] hover:shadow-lg hover:shadow-[#c9a961]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      {form.formState.isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Quero conhecer a Métis
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </div>

                  <p
                    className="text-center text-sm text-[#4a5568]/70 mt-6"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    Você será direcionado ao WhatsApp para finalizar o agendamento
                  </p>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
