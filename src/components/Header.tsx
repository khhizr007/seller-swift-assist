import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";

  const handleSignOut = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>
              Meesho<span className="text-gradient">Boost</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            {user && !isDashboard ? (
              <>
                <a href="#workspace-generate" className="transition-colors hover:text-foreground">
                  New listing
                </a>
                <Link to="/dashboard" className="transition-colors hover:text-foreground">
                  Library
                </Link>
                <a href="#generate" className="transition-colors hover:text-foreground">
                  Generator
                </a>
              </>
            ) : isDashboard ? (
              <>
                <Link to="/" className="transition-colors hover:text-foreground">
                  Workspace
                </Link>
                <a href="#history" className="transition-colors hover:text-foreground">
                  History
                </a>
              </>
            ) : (
              <>
                <a href="#how" className="transition-colors hover:text-foreground">
                  How it works
                </a>
                <a href="#generate" className="transition-colors hover:text-foreground">
                  Generate
                </a>
                <a href="#why" className="transition-colors hover:text-foreground">
                  Why us
                </a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to={isDashboard ? "/" : "/dashboard"}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">{isDashboard ? "Workspace" : "Library"}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary sm:inline-flex"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow"
                >
                  Try free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};
