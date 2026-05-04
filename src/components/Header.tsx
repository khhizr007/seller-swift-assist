import { Sparkles } from "lucide-react";

export const Header = () => (
  <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
    <div className="container flex items-center justify-between h-16">
      <a href="/" className="flex items-center gap-2 font-display font-bold text-xl">
        <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span>
          Meesho<span className="text-gradient">Boost</span>
        </span>
      </a>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
        <a href="#generate" className="hover:text-foreground transition-colors">Generate</a>
        <a href="#why" className="hover:text-foreground transition-colors">Why us</a>
      </nav>
      <a
        href="#generate"
        className="hidden sm:inline-flex items-center rounded-full bg-gradient-primary text-primary-foreground px-5 py-2 text-sm font-semibold shadow-elegant hover:shadow-glow transition-all"
      >
        Try free
      </a>
    </div>
  </header>
);
