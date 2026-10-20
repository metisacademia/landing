import { Link, useParams } from "wouter";
import PageShell, { CtaBand, FaqList, MedicalNotice, RelatedLinks, sans, serif } from "@/components/page-shell";
import NotFound from "@/pages/not-found";
import { isRoomSlug } from "@/lib/seo";
import { roomFaqs, roomOrder, rooms, type RoomSlug } from "@/lib/site";

type SalaPageProps = {
  params?: {
    slug?: string;
  };
};

export default function SalaPage({ params }: SalaPageProps) {
  const hookParams = useParams();
  const slug = params?.slug ?? hookParams.slug;
  if (!slug || !isRoomSlug(slug)) return <NotFound />;
  const room = rooms[slug];
  const others = roomOrder.filter((item) => item !== room.slug);

  return (
    <PageShell eyebrow={room.subtitle} title={room.title} lede={`${room.short} ${room.detail}`}>
      <section className="section-padding bg-white">
        <div className="container-elegant grid lg:grid-cols-2 gap-10 items-start">
          <img
            src={room.image}
            alt={room.imageAlt}
            width={room.width}
            height={room.height}
            decoding="async"
            className="w-full aspect-[4/3] object-cover rounded-3xl"
          />
          <div className="space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
            <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
              O que se trabalha nesta sala
            </h2>
            <p>{room.short}</p>
            <p>{room.detail}</p>
            <p>
              As atividades são presenciais e variam ao longo do programa. A equipe apresenta o roteiro em cada encontro.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div className="container-elegant max-w-3xl space-y-8">
          <div className="space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
            <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
              Por que isso importa no dia a dia
            </h2>
            <p>{room.why}</p>
            <p>
              A {room.title} não acontece isolada. Ela é uma parada do circuito semanal de 2h30, em grupos de até 6 pessoas, na unidade das Graças. O método foi desenvolvido por neurologistas.
            </p>
          </div>
          <MedicalNotice />
        </div>
      </section>

      <section className="section-padding-sm bg-white">
        <div className="container-elegant">
          <h2 className="text-3xl font-medium text-[#0f2940] mb-6" style={serif}>
            As outras salas do circuito
          </h2>
          <ul className="grid md:grid-cols-3 gap-4">
            {others.map((item) => (
              <li key={item}>
                <Link href={`/salas/${item}`} className="block rounded-2xl bg-[#faf8f5] p-5 hover:shadow-md transition-shadow">
                  <span className="block text-lg font-medium text-[#0f2940]" style={serif}>
                    {rooms[item].title}
                  </span>
                  <span className="block mt-2 text-sm text-[#4a5568]" style={sans}>
                    {rooms[item].subtitle}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqList faqs={roomFaqs(room)} heading="Perguntas sobre esta sala" />
      <RelatedLinks
        links={[
          { href: "/como-funciona", label: "Como funciona", text: "A ordem do circuito, a duração e o tamanho do grupo." },
          { href: "/planos", label: "Planos e preços", text: "Os quatro valores mensais e o que cada plano inclui." },
          { href: "/aula-experimental", label: "Aula experimental", text: "Um encontro gratuito para conhecer o espaço antes de decidir." },
        ]}
      />
      <CtaBand
        position={`cta_sala_${room.slug}`}
        title="Conhecer esta sala pessoalmente"
        text="A aula experimental é gratuita e sem compromisso. O agendamento é pelo WhatsApp."
      />
    </PageShell>
  );
}

export function salaPath(slug: RoomSlug): string {
  return `/salas/${slug}`;
}
