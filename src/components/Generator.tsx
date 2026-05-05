import { useCallback, useRef, useState } from "react";
import { Loader2, Lock, Sparkles, Upload, ImageIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthDialog } from "@/components/AuthDialog";
import { ListingResultView } from "@/components/ListingResultView";
import { useAuth } from "@/hooks/use-auth";
import { saveGenerationForUser } from "@/lib/prototype-storage";
import { supabase } from "@/integrations/supabase/client";
import type { ListingResult } from "@/types/listing";

const CATEGORIES = [
  "Auto-detect",
  "Women Kurtis",
  "Sarees",
  "Women Dresses",
  "Men T-Shirts",
  "Men Shirts",
  "Watches",
  "Jewellery",
  "Bags & Wallets",
  "Footwear",
  "Home & Kitchen",
  "Beauty",
  "Kids",
  "Other",
];

const GUEST_LIMIT = 1;
const GUEST_USAGE_KEY = "meesho-boost-guest-usage-count";

const getGuestUsageCount = () => {
  if (typeof window === "undefined") return 0;

  const raw = window.localStorage.getItem(GUEST_USAGE_KEY);
  const parsed = Number(raw ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const Generator = ({ mode = "landing" }: { mode?: "landing" | "workspace" }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ListingResult | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [guestUsageCount, setGuestUsageCount] = useState(getGuestUsageCount);
  const inputRef = useRef<HTMLInputElement>(null);
  const guestLocked = !user && guestUsageCount >= GUEST_LIMIT;

  const handleFile = useCallback(async (nextFile: File) => {
    if (!nextFile.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (nextFile.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    setFile(nextFile);
    setPreview(await fileToDataUrl(nextFile));
    setResult(null);
  }, []);

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const saveGeneration = (generated: ListingResult) => {
    if (!user) return;

    saveGenerationForUser({
      userId: user.id,
      sourceCategory: category === "Auto-detect" ? null : category,
      sourceNotes: notes || null,
      sourceFilename: file?.name || null,
      result: generated,
    });
  };

  const markGuestUsage = () => {
    const nextCount = guestUsageCount + 1;
    setGuestUsageCount(nextCount);
    window.localStorage.setItem(GUEST_USAGE_KEY, String(nextCount));
  };

  const generate = async () => {
    if (!preview) {
      toast.error("Please upload a product image first");
      return;
    }

    if (guestLocked) {
      toast.error("Your free guest run is used. Login to generate more listings.");
      setAuthOpen(true);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-listing", {
        body: {
          imageBase64: preview,
          category: category === "Auto-detect" ? undefined : category,
          notes: notes || undefined,
        },
      });

      if (error) throw error;
      if ((data as { error?: string } | null)?.error) throw new Error((data as { error: string }).error);

      const generated = data as ListingResult;
      setResult(generated);

      if (user) {
        saveGeneration(generated);
        toast.success("Listing generated and saved to your dashboard.");
      } else {
        markGuestUsage();
        toast.success("Listing generated. Login to save every future result.");
      }

      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="generate" className={mode === "workspace" ? "py-10 md:py-14" : "py-20 md:py-28"}>
        <div className="container">
          {mode === "landing" ? (
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                Generate
              </div>
              <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                Try it on your <span className="text-gradient">product</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">Upload one photo. We'll handle the rest.</p>
            </div>
          ) : (
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  Workspace Generator
                </div>
                <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                  Create your next <span className="text-gradient">Meesho-ready listing</span>
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Upload a product photo, add optional seller notes, and we’ll save the result back to your workspace.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
              >
                Open full library
              </Link>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
                <label
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onDrop}
                  className="group block cursor-pointer"
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])}
                  />

                  {preview ? (
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                      <img src={preview} alt="Product preview" className="h-full w-full object-contain" />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setPreview("");
                          setFile(null);
                          setResult(null);
                        }}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow-elegant transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-border p-6 text-center transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
                      <div>
                        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary/10">
                          <Upload className="h-7 w-7 text-primary" />
                        </div>
                        <div className="font-display text-lg font-bold">Drop your product photo</div>
                        <div className="mt-1 text-sm text-muted-foreground">or click to browse · JPG/PNG · up to 10MB</div>
                      </div>
                    </div>
                  )}
                </label>

                <div className="mt-5 space-y-4">
                  {!user && (
                    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">
                            {guestLocked ? "Free guest run used" : "1 free guest generation available"}
                          </div>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Login to unlock unlimited generations and a private dashboard for your saved listings.
                          </p>
                          <button
                            type="button"
                            onClick={() => setAuthOpen(true)}
                            className="mt-3 inline-flex rounded-full border border-primary/20 bg-background px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                          >
                            Login to continue
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {user && (
                    <div className="rounded-2xl border border-success/15 bg-green-50 p-4">
                      <div className="text-sm font-semibold text-foreground">Saving is on</div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Every generated image set and listing insight will be added to your dashboard automatically.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Category</label>
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">
                      Notes <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={2}
                      placeholder="e.g. Pack of 3, available in sizes M-XXL"
                      className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <button
                    onClick={generate}
                    disabled={loading || !preview}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                      </>
                    ) : guestLocked ? (
                      <>
                        <Lock className="h-4 w-4" /> Login to generate more
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Generate Meesho listing
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    {user
                      ? "Takes ~15 sec · creates 3 image variants + full listing · auto-saved"
                      : "Takes ~15 sec · 1 free guest run · login unlocks saved history"}
                  </p>
                </div>
              </div>
            </div>

            <div id="result" className="lg:col-span-3">
              {!result && !loading && (
                <div className="grid min-h-[400px] h-full place-items-center rounded-3xl border-2 border-dashed border-border p-12 text-center">
                  <div>
                    <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-muted">
                      <ImageIcon className="h-9 w-9 text-muted-foreground" />
                    </div>
                    <div className="font-display text-xl font-bold">Your listing will appear here</div>
                    <div className="mt-1 text-muted-foreground">Upload a product photo to get started</div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="rounded-3xl border border-border/50 bg-gradient-card p-8 shadow-soft">
                  <div className="mb-6 grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="aspect-square rounded-2xl bg-muted animate-shimmer" />
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="h-7 w-3/4 rounded-lg bg-muted animate-shimmer" />
                    <div className="h-4 rounded-lg bg-muted animate-shimmer" />
                    <div className="h-4 w-5/6 rounded-lg bg-muted animate-shimmer" />
                    <div className="h-4 w-4/6 rounded-lg bg-muted animate-shimmer" />
                  </div>
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Crafting your Meesho-ready listing — this usually takes 10–20 seconds…
                  </p>
                </div>
              )}

              {result && <ListingResultView result={result} showAnimation />}
            </div>
          </div>
        </div>
      </section>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};
