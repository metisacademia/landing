import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Quando a academia inaugura?",
      answer: "A inauguração está prevista para Novembro/2025. Entraremos em contato com todos os pré-matriculados para agendamento das primeiras turmas. A pré-matrícula garante sua prioridade de vaga."
    },
    {
      question: "Preciso de encaminhamento médico?",
      answer: "Não é obrigatório. A Métis é um programa de estímulo cognitivo preventivo, aberto a qualquer pessoa interessada em cuidar da saúde mental e cognitiva."
    },
    {
      question: "Como escolho os horários?",
      answer: "Você indica suas preferências na pré-matrícula e nossa equipe confirma a disponibilidade por WhatsApp, garantindo o melhor encaixe em sua rotina."
    },
    {
      question: "Posso experimentar antes de me matricular?",
      answer: "Sim! Oferecemos aula experimental com vagas limitadas. É uma oportunidade de conhecer nossa metodologia e ambiente antes de tomar sua decisão."
    },
    {
      question: "Existe reembolso da pré-matrícula?",
      answer: "Sim! Caso você não perceba valor após participar da aula experimental, devolvemos integralmente o valor da pré-matrícula. Sua satisfação é nossa garantia."
    },
    {
      question: "Qual a base científica da metodologia?",
      answer: "Nossa metodologia é baseada em intervenções não-farmacológicas com evidências científicas comprovadas em estudos sobre envelhecimento cognitivo saudável e prevenção de declínio cognitivo."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="faq-title">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-lg border-border" data-testid={`faq-${index}`}>
              <CardContent className="p-6">
                <button 
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                  data-testid={`faq-${index}-button`}
                >
                  <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="mt-4 text-muted-foreground" data-testid={`faq-${index}-answer`}>
                    {faq.answer}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
