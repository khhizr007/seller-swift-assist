import { useState } from "react";
import { KeyRound, Loader2, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleAuth = async (type: "signin" | "signup") => {
    if (!email.trim()) {
      toast.error("Enter your email to continue");
      return;
    }

    if (!password.trim() || password.length < 6) {
      toast.error("Use a password with at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (type === "signup") {
        await signup(email.trim(), password);
        toast.success("Prototype account created.");
      } else {
        await login(email.trim(), password);
        toast.success("Logged in successfully.");
      }

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Could not complete login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[2rem] border-border/60 bg-gradient-card p-0 shadow-elegant">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-hero opacity-95" />
          <div className="relative p-8 text-primary-foreground">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles className="h-6 w-6" />
            </div>
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="font-display text-3xl font-extrabold">Login to keep every listing</DialogTitle>
              <DialogDescription className="text-primary-foreground/85">
                Simple prototype login with local saved history. No external auth setup needed.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="space-y-4 p-8 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email address</Label>
              <div className="flex items-center gap-3 rounded-2xl border border-input bg-background px-4 py-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seller@example.com"
                  className="border-0 px-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-password">Password</Label>
              <div className="flex items-center gap-3 rounded-2xl border border-input bg-background px-4 py-1">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="border-0 px-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleAuth("signin")}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Sign in
              </button>
              <button
                type="button"
                onClick={() => handleAuth("signup")}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-5 py-3 font-semibold transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Create account
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              This prototype login stores users and sessions locally in your browser for now.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
