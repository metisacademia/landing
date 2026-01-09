import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const leadFormSchema = z.object({
  name: z.string().min(3, "Por favor, informe seu nome completo"),
  phone: z.string().min(10, "Por favor, informe um telefone válido"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function LeadFormSection() {
  const { toast } = useToast();
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const openWhatsApp = () => {
    window.open('https://wa.me/5581992726495', '_blank');
  };

  const onSubmit = (data: LeadFormData) => {
    const message = `Olá! Meu nome é ${data.name} e gostaria de agendar uma aula experimental. Meu telefone: ${data.phone}`;
    const whatsappUrl = `https://wa.me/5581992726495?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para o WhatsApp",
      description: "Complete o agendamento pelo WhatsApp.",
    });
    
    form.reset();
  };

  return (
    <section id="agendar" className="py-20 bg-gradient-to-br from-[#cda465]/10 to-[#f8f1e7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-[#cda465]/20">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#cda465]/20 border border-[#cda465] text-[#cda465] rounded-full px-4 py-1 text-sm font-medium mb-4">
              Agende sua aula
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              Experimente gratuitamente
            </h2>
            <p className="text-lg text-[#1a1a2e]/70">
              Deixe seus dados e entraremos em contato para agendar sua aula experimental.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        className="h-14 text-lg border-2 border-[#cda465]/30 focus:border-[#cda465] rounded-xl"
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
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Seu WhatsApp (81) 99999-9999"
                        className="h-14 text-lg border-2 border-[#cda465]/30 focus:border-[#cda465] rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-14 text-lg font-bold bg-[#cda465] hover:bg-[#cda465]/90 text-[#1a1a2e] rounded-xl shadow-lg"
              >
                {form.formState.isSubmitting ? "Enviando..." : "Agendar minha aula experimental"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-[#1a1a2e]/60 text-sm mb-4">
              Ou entre em contato diretamente:
            </p>
            <Button
              onClick={openWhatsApp}
              variant="outline"
              className="border-2 border-[#1a1a2e]/20 text-[#1a1a2e] hover:bg-[#1a1a2e]/5 rounded-xl"
            >
              Falar pelo WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
