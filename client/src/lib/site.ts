/**
 * Fatos públicos da Métis, usados no texto e no schema.
 * Não acrescentar nome de profissional, CRM, depoimento, nota, prêmio ou estatística
 * sem confirmação da equipe.
 */

export const SITE_URL = "https://www.metisacademia.com.br";

export const NAP_NAME = "Métis Academia da Mente";

export const PHONE_E164 = "5581992726495";
export const PHONE_DISPLAY = "(81) 99272-6495";
export const PHONE_TEL = "+5581992726495";
export const PHONE_SCHEMA = "+55-81-99272-6495";
export const EMAIL = "atendimento@metisacademia.com.br";
export const INSTAGRAM_URL = "https://www.instagram.com/metisacademiabr/";

export const ADDRESS = {
  street: "R. das Pernambucanas, 407, sala 1203",
  building: "Kronos Empresarial",
  neighborhood: "Graças",
  city: "Recife",
  region: "PE",
  postalCode: "52011-010",
  country: "BR",
} as const;

export const ADDRESS_ONE_LINE =
  "R. das Pernambucanas, 407, sala 1203 – Kronos Empresarial, Graças, Recife – PE, CEP 52011-010";

export const MAPS_URL =
  "https://maps.google.com/?q=R.+das+Pernambucanas,+407,+Gra%C3%A7as,+Recife";

export const MAPS_EMBED =
  "https://maps.google.com/maps?q=Rua+das+Pernambucanas+407,+Gra%C3%A7as,+Recife&z=16&output=embed";

/**
 * Posição da Rua das Pernambucanas, Graças, no OpenStreetMap (consulta em 20/10/2026).
 * Não é um levantamento do número 407, sala 1203. A equipe confirma o pino.
 */
export const GEO = {
  latitude: -8.0513462,
  longitude: -34.8998066,
} as const;

export const OG_IMAGE = `${SITE_URL}/images/logo-metis-bg-color.jpg`;

export const BUSINESS_DESCRIPTION =
  "Academia de treino cognitivo presencial para adultos, nas Graças, Recife. Circuito semanal de 2h30 em quatro salas, em grupos de até 6 pessoas. Método desenvolvido por neurologistas. É um programa de estímulo cognitivo e não substitui avaliação médica.";

export const TRIAL_MESSAGE =
  "Olá! Gostaria de agendar uma aula experimental na Métis.";

export const PLANS_MESSAGE =
  "Olá! Gostaria de saber mais sobre os planos da Métis.";

export const DOCTOR_MESSAGE =
  "Olá! Sou profissional de saúde e gostaria de indicar alguém para conhecer a Métis.";

export type Plan = {
  id: "mensal" | "trimestral" | "semestral" | "anual";
  name: string;
  price: string;
  priceSchema: string;
  savings: string;
  popular: boolean;
  benefits: readonly string[];
};

export const plans: readonly Plan[] = [
  {
    id: "mensal",
    name: "Mensal",
    price: "1.145",
    priceSchema: "1145.00",
    savings: "155",
    popular: false,
    benefits: [
      "1 aula semanal de 2h30",
      "Circuito completo das 4 salas",
      "Material didático incluso",
    ],
  },
  {
    id: "trimestral",
    name: "Trimestral",
    price: "990",
    priceSchema: "990.00",
    savings: "300",
    popular: false,
    benefits: [
      "1 aula semanal de 2h30",
      "Circuito completo das 4 salas",
      "Material didático incluso",
      "Acompanhamento personalizado",
    ],
  },
  {
    id: "semestral",
    name: "Semestral",
    price: "890",
    priceSchema: "890.00",
    savings: "600",
    popular: true,
    benefits: [
      "1 aula semanal de 2h30",
      "Circuito completo das 4 salas",
      "Material didático incluso",
      "Acompanhamento personalizado",
      "Relatório de evolução",
    ],
  },
  {
    id: "anual",
    name: "Anual",
    price: "790",
    priceSchema: "790.00",
    savings: "1.200",
    popular: false,
    benefits: [
      "1 aula semanal de 2h30",
      "Circuito completo das 4 salas",
      "Material didático incluso",
      "Acompanhamento personalizado",
      "Relatório de evolução",
      "Prioridade em eventos",
    ],
  },
];

export const PRICE_RANGE_LABEL = "R$ 790 a R$ 1.145 por mês";
export const PRICE_RANGE_SCHEMA = "R$790–R$1.145";

export type Faq = {
  question: string;
  answer: string;
};

export const homeFaqs: readonly Faq[] = [
  {
    question: "Como funciona o circuito das 4 salas?",
    answer:
      "O circuito é uma jornada semanal de 2h30 por quatro ambientes temáticos: Linguagem, Memória, Funções Executivas e Contemplação. Cada sala trabalha diferentes capacidades cognitivas com atividades práticas e culturais.",
  },
  {
    question: "Preciso de encaminhamento médico?",
    answer:
      "Não é obrigatório. A Métis é um programa de estímulo cognitivo aberto a adultos que querem manter a mente ativa. Quem tem acompanhamento médico continua com ele normalmente.",
  },
  {
    question: "Como escolho meus horários?",
    answer:
      "Ao se matricular, você indica suas preferências de dias e horários. Nossa equipe confirma a disponibilidade por WhatsApp, garantindo o melhor encaixe em sua rotina.",
  },
  {
    question: "Posso fazer uma aula experimental?",
    answer:
      "Sim! Oferecemos aula experimental gratuita para você conhecer nossa metodologia, equipe e ambiente antes de tomar sua decisão.",
  },
  {
    question: "Quantas pessoas por turma?",
    answer:
      "Trabalhamos com grupos pequenos de até 6 pessoas, garantindo atenção personalizada e interação de qualidade entre os participantes.",
  },
  {
    question: "Qual a base científica da metodologia?",
    answer:
      "A metodologia foi desenvolvida por neurologistas e é baseada em intervenções não farmacológicas estudadas na literatura científica sobre envelhecimento cognitivo. É uma atividade de estímulo, não um tratamento.",
  },
];

export const extraFaqs: readonly Faq[] = [
  {
    question: "Onde fica a Métis Academia da Mente?",
    answer: `A Métis fica na ${ADDRESS_ONE_LINE}. O contato é o WhatsApp ${PHONE_DISPLAY} e o e-mail ${EMAIL}.`,
  },
  {
    question: "Quanto custam os planos?",
    answer:
      "Os valores mensais são: plano mensal R$ 1.145, trimestral R$ 990, semestral R$ 890 e anual R$ 790. Todos incluem 1 aula semanal de 2h30, o circuito completo das 4 salas e material didático. Os demais benefícios mudam conforme o plano. A aula experimental é gratuita.",
  },
  {
    question: "A Métis trata ou previne Alzheimer e demência?",
    answer:
      "Não. A Métis não trata, não previne e não cura Alzheimer, demência ou qualquer outra doença. É um programa de estímulo cognitivo para memória, linguagem, atenção e funções executivas, e não substitui consulta, diagnóstico ou tratamento médico.",
  },
  {
    question: "Como agendo a aula experimental?",
    answer: `Pelo WhatsApp ${PHONE_DISPLAY}. A aula é gratuita e sem compromisso. A equipe confirma o horário e os detalhes. A duração e os detalhes são informados no agendamento.`,
  },
  {
    question: "Com que frequência são os encontros e quanto duram?",
    answer:
      "O programa é presencial, uma vez por semana, com duração de 2 horas e 30 minutos, no circuito das quatro salas, em grupos de até 6 pessoas.",
  },
  {
    question: "Qual o horário de funcionamento?",
    answer:
      "Os dias e horários de turma são informados pelo WhatsApp, na matrícula ou no agendamento da aula experimental.",
  },
  {
    question: "Preciso morar nas Graças para participar?",
    answer:
      "Não. A unidade fica nas Graças, em Recife, e recebe alunos de qualquer bairro. O caminho e o estacionamento podem ser confirmados pelo WhatsApp.",
  },
];

export const allFaqs: readonly Faq[] = [...homeFaqs, ...extraFaqs];

export type RoomSlug =
  | "linguagem"
  | "memoria"
  | "funcoes-executivas"
  | "contemplacao";

export type Room = {
  slug: RoomSlug;
  title: string;
  subtitle: string;
  short: string;
  detail: string;
  why: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
  seoTitle: string;
  seoDescription: string;
};

export const rooms: Record<RoomSlug, Room> = {
  linguagem: {
    slug: "linguagem",
    title: "Sala da Linguagem",
    subtitle: "Expressão e comunicação",
    short:
      "Aqui é onde a expressão ganha forma. Na sala da linguagem, você exercita comunicação, criatividade e a construção de ideias.",
    detail:
      "É a biblioteca viva do seu cérebro. Através de atividades que desenvolvem e expandem vocabulário, interpretação e expressão escrita e verbal, você transforma seu potencial comunicativo. Cada palavra é uma ferramenta de transformação em suas mãos.",
    why: "No dia a dia, a linguagem aparece na conversa, na leitura e na hora de organizar uma ideia para outra pessoa. Nesta sala o trabalho é esse exercício de vocabulário, interpretação e expressão, em grupo pequeno. Não é terapia de fala nem reabilitação.",
    image: "/images/sala-linguagem.jpg",
    imageAlt:
      "Sala da Linguagem da Métis Academia da Mente, no bairro das Graças, em Recife",
    width: 1024,
    height: 768,
    seoTitle: "Sala da Linguagem | Treino de linguagem na Métis, Recife",
    seoDescription:
      "A Sala da Linguagem da Métis, nas Graças, exercita vocabulário, interpretação e expressão em grupos de até 6, no circuito semanal de 2h30.",
  },
  memoria: {
    slug: "memoria",
    title: "Sala da Memória",
    subtitle: "Lembrança e experiência",
    short:
      "Neste ambiente, você revive, lembra e assimila experiências e conhecimentos culturais.",
    detail:
      "É um mergulho nas suas próprias histórias — cada lembrança, uma ponte entre o passado e o agora. Estímulo e desenvolvimento da memória e expansão de conhecimentos culturais. É o arquivo vivo das suas experiências, onde você cultiva e expande seu repertório cultural.",
    why: "Lembrar um nome, um compromisso ou um caminho faz parte da rotina. A sala trabalha o estímulo da memória junto com conhecimentos culturais. Não é um teste clínico e não entrega um diagnóstico.",
    image: "/images/sala-memoria.jpg",
    imageAlt:
      "Sala da Memória da Métis Academia da Mente, no bairro das Graças, em Recife",
    width: 480,
    height: 360,
    seoTitle: "Sala da Memória | Treino de memória para adultos em Recife",
    seoDescription:
      "A Sala da Memória da Métis, nas Graças, estimula memória e repertório cultural em grupos de até 6, no circuito semanal de 2h30.",
  },
  "funcoes-executivas": {
    slug: "funcoes-executivas",
    title: "Sala das Funções Executivas",
    subtitle: "Foco, planejamento e tomada de decisão",
    short:
      "Aqui o foco é atenção, planejamento e resolução de problemas.",
    detail:
      "Integração corpo-mente, com estímulo da atenção, planejamento e resolução de problemas. É o centro de comando de suas ações, onde as interações se tornam movimento e você fortalece suas habilidades de execução.",
    why: "Funções executivas são as habilidades de manter a atenção, planejar um passo de cada vez e resolver um problema cotidiano. O trabalho é presencial, em grupo, e não é uma avaliação neuropsicológica.",
    image: "/images/sala-executiva.jpg",
    imageAlt:
      "Sala das Funções Executivas da Métis Academia da Mente, no bairro das Graças, em Recife",
    width: 768,
    height: 1024,
    seoTitle:
      "Sala das Funções Executivas | Atenção e planejamento na Métis",
    seoDescription:
      "Atenção, planejamento e resolução de problemas na Sala das Funções Executivas da Métis, nas Graças, no circuito de 2h30.",
  },
  contemplacao: {
    slug: "contemplacao",
    title: "Sala da Contemplação",
    subtitle: "Presença e integração",
    short:
      "Depois do esforço cognitivo, chega o momento da pausa. Aqui a mente descansa e consolida.",
    detail:
      "É o espaço onde sua mente descansa e consolida. Depois da estimulação, você entra em estado contemplativo ativo, onde o cérebro descansa e integra tudo o que foi vivido. Aqui, a presença se torna aprendizado consolidado.",
    why: "A pausa faz parte do circuito. Depois do estímulo, a pessoa entra em um estado contemplativo ativo e integra o que viveu nas outras salas. A curadoria cultural — livros, obras, filmes e playlists — acompanha a experiência.",
    image: "/images/sala-contemplacao.jpg",
    imageAlt:
      "Sala da Contemplação da Métis Academia da Mente, no bairro das Graças, em Recife",
    width: 768,
    height: 1024,
    seoTitle: "Sala da Contemplação | Pausa e cultura na Métis, Recife",
    seoDescription:
      "A Sala da Contemplação fecha o circuito da Métis nas Graças: pausa e integração depois do estímulo, em grupos de até 6.",
  },
};

export const roomOrder: readonly RoomSlug[] = [
  "linguagem",
  "memoria",
  "funcoes-executivas",
  "contemplacao",
];

export function roomFaqs(room: Room): Faq[] {
  return [
    {
      question: `O que se trabalha na ${room.title}?`,
      answer: `${room.short} ${room.detail}`,
    },
    {
      question: "Esta sala funciona sozinha?",
      answer: `Não. A ${room.title} é uma das quatro paradas do circuito semanal de 2h30, em grupos de até 6 pessoas, na unidade das Graças. As atividades presenciais mudam ao longo do programa e são apresentadas pela equipe na aula.`,
    },
  ];
}

export const navLinks = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/planos", label: "Planos" },
  { href: "/aula-experimental", label: "Aula experimental" },
  { href: "/contato", label: "Contato" },
] as const;

export const footerExplore = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/planos", label: "Planos e preços" },
  { href: "/aula-experimental", label: "Aula experimental" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/treino-cognitivo-em-recife", label: "Treino cognitivo em Recife" },
  { href: "/para-medicos", label: "Para médicos" },
  { href: "/contato", label: "Contato e como chegar" },
] as const;

export function canonicalUrl(path: string): string {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}
