import { Link } from "wouter";
import { MessageCircle, Brain, Dumbbell, Leaf } from "lucide-react";
import { roomOrder, rooms, type RoomSlug } from "@/lib/site";

const roomStyle: Record<RoomSlug, { icon: typeof Brain; color: string }> = {
  linguagem: { icon: MessageCircle, color: "bg-slate-700" },
  memoria: { icon: Brain, color: "bg-red-800" },
  "funcoes-executivas": { icon: Dumbbell, color: "bg-amber-600" },
  contemplacao: { icon: Leaf, color: "bg-slate-500" },
};

export default function CircuitSection() {
  return (
    <section id="como-funciona" className="section-padding bg-[#0f2940] relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 h-48 w-48 rounded-full bg-[#c9a961]/5 blur-3xl sm:h-72 sm:w-72" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#c9a961]/5 blur-3xl sm:h-72 sm:w-72" aria-hidden="true" />

      <div className="container-elegant mb-16 relative z-10">
        <div className="text-center">
          <span
            className="inline-block text-sm font-medium text-[#c9a961] uppercase tracking-widest mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Nossa Metodologia
          </span>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="circuit-title"
          >
            Circuito das 4 Salas
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto mb-8" />

          <p
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="circuit-description"
          >
            Cada sala foi cuidadosamente projetada para estimular diferentes capacidades cognitivas. O encontro semanal dura 2h30, em grupos de até 6 pessoas.
          </p>
          <p className="mt-6">
            <Link
              href="/como-funciona"
              className="text-[#c9a961] font-medium underline decoration-[#c9a961]/40 underline-offset-4"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              Veja como o circuito funciona
            </Link>
          </p>
        </div>
      </div>

      <div className="container-elegant relative z-10">
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {roomOrder.map((slug) => {
            const room = rooms[slug];
            const style = roomStyle[slug];
            const Icon = style.icon;
            return (
              <Link
                key={slug}
                href={`/salas/${slug}`}
                className="group relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-2xl sm:min-h-[30rem] lg:min-h-[40rem]"
                data-testid={`room-card-${slug}`}
              >
                <img
                  src={room.image}
                  alt={room.imageAlt}
                  width={room.width}
                  height={room.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 0%, rgba(23,59,90,0.88) 16%, #173b5a 36%, #0b0b28 54%, #0b0b28 100%)",
                  }}
                />
                <div className="relative z-10 mt-auto flex w-full flex-col p-5 md:p-6">
                  <div className={`mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3
                    className="mb-1 min-h-[3.25rem] text-lg font-medium leading-tight text-white md:min-h-[3.5rem] md:text-xl"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    data-testid={`room-title-${slug}`}
                  >
                    {room.title}
                  </h3>
                  <p
                    className="mb-2 min-h-[2.75rem] text-sm leading-snug text-white"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    data-testid={`room-subtitle-${slug}`}
                  >
                    {room.subtitle}
                  </p>
                  <p
                    className="min-h-[6.75rem] text-sm leading-relaxed text-white lg:min-h-[9rem]"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    data-testid={`room-description-${slug}`}
                  >
                    {room.short}
                  </p>
                  <span
                    className="pt-4 text-sm font-medium text-[#c9a961]"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    data-testid={`room-link-${slug}`}
                  >
                    Conheça a sala
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-[#c9a961]/50" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
