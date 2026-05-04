import { ImageIcon, PenLine, Tags, IndianRupee, Languages, Zap } from "lucide-react";

const features = [
  { icon: ImageIcon, title: "Studio-quality images", desc: "White background, lifestyle and pastel variants — generated from one photo." },
  { icon: PenLine, title: "Meesho-style copy", desc: "Mobile-first titles & descriptions written for Indian buyers." },
  { icon: Tags, title: "Smart tags & category", desc: "5–10 trending keywords and the right Meesho category, auto-detected." },
  { icon: IndianRupee, title: "Price suggestion", desc: "Get a sensible INR price range based on the product." },
  { icon: Languages, title: "Simple English", desc: "Easy-to-read tone that matches how Meesho buyers actually shop." },
  { icon: Zap, title: "Fast & affordable", desc: "Each listing in ~15 seconds, optimized to keep AI costs low." },
];

export const Features = () => (
  <section id="why" className="py-20 md:py-28">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold tracking-wide uppercase mb-4">
          Why MeeshoBoost
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          Designed for the way <span className="text-gradient">Meesho</span> works
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-gradient-primary/10 grid place-items-center mb-4">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
