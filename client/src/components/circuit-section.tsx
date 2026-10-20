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
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#c9a961]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c9a961]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {roomOrder.map((slug) => {
            const room = rooms[slug];
            const style = roomStyle[slug];
            const Icon = style.icon;
            return (
              <Link
                key={slug}
                href={`/salas/${slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
                data-testid={`room-card-${slug}`}
              >
                <img
                  src={room.image}
                  alt={room.imageAlt}
                  width={room.width}
                  height={room.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2940]/95 via-[#0f2940]/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <div className={`w-12 h-12 ${style.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3
                    className="text-lg md:text-xl font-medium text-white leading-tight mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {room.title}
                  </h3>
                  <p
                    className="text-sm text-white/70 mb-2"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    {room.subtitle}
                  </p>
                  <p
                    className="text-sm text-white/80 mb-3 line-clamp-3"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    {room.short}
                  </p>
                  <span
                    className="text-sm font-medium text-[#c9a961]"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    Conheça a sala
                  </span>
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#c9a961]/50 transition-colors duration-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
