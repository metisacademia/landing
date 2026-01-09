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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const leadFormSchema = z.object({
  name: z.string().min(3, "Por favor, informe seu nome completo"),
  phone: z.string().min(10, "Por favor, informe um telefone válido"),
  source: z.string().min(1, "Por favor, selecione uma opção"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function LeadFormSection() {
  const { toast } = useToast();
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      source: "",
    },
  });

  const sourceOptions = [
    "Indicação médica",
    "Indicação de amigo/familiar",
    "Redes sociais",
    "Busca no Google",
  ];

  const onSubmit = (data: LeadFormData) => {
    const message = `Olá! Meu nome é ${data.name} e gostaria de agendar uma aula experimental. Meu telefone: ${data.phone}. Conheci a Métis por: ${data.source}`;
    const whatsappUrl = `https://wa.me/5581992726495?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para o WhatsApp",
      description: "Complete o agendamento pelo WhatsApp.",
    });
    
    form.reset();
  };

  return (
    <section id="formulario" className="py-20 bg-[#1a1a2e]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
          Agende sua aula experimental
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-lg p-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#1a1a2e]">Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        className="w-full border rounded-lg px-4 py-2"
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
                    <FormLabel className="text-sm font-medium text-[#1a1a2e]">WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(81) 99999-9999"
                        className="w-full border rounded-lg px-4 py-2"
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
                    <FormLabel className="text-sm font-medium text-[#1a1a2e]">Como conheceu a Métis?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        {sourceOptions.map((opt) => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={opt} />
                            <label htmlFor={opt} className="text-sm text-[#1a1a2e]">{opt}</label>
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
                className="w-full bg-[#cda465] text-white font-bold py-3 rounded-lg hover:bg-[#cda465]/90"
              >
                {form.formState.isSubmitting ? "Enviando..." : "QUERO CONHECER A MÉTIS"}
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-500 space-y-1">
              <p>✓ Aula experimental gratuita</p>
              <p>✓ Sem compromisso</p>
              <p>✓ Respondemos em até 24h</p>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
