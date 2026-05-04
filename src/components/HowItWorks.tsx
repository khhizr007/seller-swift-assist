import { Camera, Wand2, Download } from "lucide-react";

const steps = [
  { icon: Camera, title: "Upload your photo", desc: "Any product image — phone snap or studio shot. JPG or PNG up to 10MB." },
  { icon: Wand2, title: "AI does the rest", desc: "We generate Meesho-ready images, title, description, bullets, tags and price." },
  { icon: Download, title: "Copy & list on Meesho", desc: "Download images, copy text, and paste straight into your Meesho catalog." },
];

export const HowItWorks = () => (
  <section id="how" className="py-20 md:py-28 bg-muted/30">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold tracking-wide uppercase mb-4">
          How it works
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          From photo to live listing in <span className="text-gradient">3 steps</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-3xl bg-gradient-card border border-border/50 p-8 shadow-soft hover:shadow-elegant transition-all"
          >
            <div className="absolute -top-4 left-8 h-8 w-8 grid place-items-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold shadow-elegant">
              {i + 1}
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center mb-5">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
