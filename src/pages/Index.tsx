import { Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Generator } from "@/components/Generator";
import { Features } from "@/components/Features";
import { WorkspaceHome } from "@/components/WorkspaceHome";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {user ? (
        <WorkspaceHome />
      ) : (
        <main className="flex-1">
          <Hero />
          <HowItWorks />
          <Generator />
          <Features />

          <section className="py-20">
            <div className="container">
              <div className="rounded-3xl bg-gradient-hero p-10 md:p-16 text-center text-primary-foreground shadow-elegant relative overflow-hidden">
                <div className="absolute inset-0 bg-foreground/10" />
                <div className="relative">
                  <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-90" />
                  <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
                    Ready to triple your Meesho conversions?
                  </h2>
                  <p className="mt-4 opacity-90 max-w-xl mx-auto">
                    Join sellers who ship better catalogs in minutes, not days.
                  </p>
                  <a
                    href="#generate"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-3.5 font-semibold shadow-elegant hover:scale-105 transition-transform"
                  >
                    Generate your first listing free
                  </a>
                  <p className="mt-4 text-sm opacity-80">
                    One free guest generation. Login unlocks saved history and unlimited follow-ups.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <div className="container">
          Built for Meesho sellers in India · Powered by AI · © {new Date().getFullYear()} MeeshoBoost
        </div>
      </footer>
    </div>
  );
};

export default Index;
