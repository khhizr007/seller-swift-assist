import { Sparkles, Zap, Globe2 } from "lucide-react";

export const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-10" />
    <div
      className="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full blur-3xl opacity-30 animate-float"
      style={{ background: "var(--gradient-primary)" }}
    />
    <div
      className="absolute -bottom-40 -left-40 -z-10 h-[500px] w-[500px] rounded-full blur-3xl opacity-25 animate-float"
      style={{ background: "var(--gradient-warm)", animationDelay: "1.5s" }}
    />

    <div className="container py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
      <div className="animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
          <Sparkles className="h-3.5 w-3.5" /> Built for Meesho sellers in India
        </div>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
          One photo.
          <br />
          A full <span className="text-gradient">Meesho listing.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
          Upload any product photo and get studio-quality images, a high-converting title,
          description, tags and price suggestions — ready to paste into Meesho in under 30 seconds.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#generate"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-7 py-3.5 font-semibold shadow-elegant hover:shadow-glow transition-all"
          >
            <Zap className="h-4 w-4" /> Generate listing free
          </a>
          <a
            href="#how"
            className="inline-flex items-center rounded-full border border-border bg-card px-7 py-3.5 font-semibold hover:bg-muted transition-colors"
          >
            See how it works
          </a>
        </div>
        <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> ~15 sec per product</div>
          <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /> Indian context built-in</div>
        </div>
      </div>

      <div className="relative">
        <div className="relative aspect-[4/5] rounded-3xl bg-gradient-card shadow-elegant border border-border/50 p-6 animate-float">
          <div className="absolute -top-4 -right-4 rounded-2xl bg-gradient-warm text-primary-foreground px-4 py-2 text-sm font-bold shadow-elegant rotate-3">
            +3 image variants ✨
          </div>
          <div className="grid grid-cols-2 gap-3 h-full">
            <div className="rounded-2xl bg-muted overflow-hidden grid place-items-center text-6xl">👗</div>
            <div className="rounded-2xl bg-gradient-primary/10 overflow-hidden grid place-items-center text-6xl">🏠</div>
            <div className="rounded-2xl bg-gradient-warm/20 overflow-hidden grid place-items-center text-6xl">🛍️</div>
            <div className="rounded-2xl bg-card border border-border p-3 text-xs">
              <div className="font-bold text-sm mb-1 leading-tight">Stylish Cotton Kurti for Women | Latest Printed Design</div>
              <div className="text-muted-foreground">Comfortable daily wear • Pack of 1</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {["#kurti", "#latest", "#cotton"].map((t) => (
                  <span key={t} className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
