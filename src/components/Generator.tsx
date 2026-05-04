import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  Sparkles,
  Download,
  Copy,
  Check,
  ImageIcon,
  X,
  Tag,
  IndianRupee,
} from "lucide-react";

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

type Listing = {
  title: string;
  description: string;
  bullets: string[];
  category: string;
  tags: string[];
  suggestedPriceInr: { min: number; max: number };
  attributes: Record<string, string>;
};

type Result = { listing: Listing; images: string[] };

const fileToDataUrl = (file: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const CopyBtn = ({ text, label = "Copy" }: { text: string; label?: string }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setDone(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary px-3 py-1.5 text-xs font-semibold transition-colors"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
};

export const Generator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    setFile(f);
    setPreview(await fileToDataUrl(f));
    setResult(null);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const generate = async () => {
    if (!preview) {
      toast.error("Please upload a product image first");
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
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult(data as Result);
      toast.success("Listing generated! 🎉");
      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url: string, idx: number) => {
    try {
      const blob = await (await fetch(url)).blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `meesho-image-${idx + 1}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      toast.error("Could not download image");
    }
  };

  const fullCopy = result
    ? `${result.listing.title}\n\n${result.listing.description}\n\n${result.listing.bullets
        .map((b) => `• ${b}`)
        .join("\n")}\n\nTags: ${result.listing.tags.join(", ")}\nCategory: ${result.listing.category}\nPrice: ₹${result.listing.suggestedPriceInr.min}–₹${result.listing.suggestedPriceInr.max}`
    : "";

  return (
    <section id="generate" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold tracking-wide uppercase mb-4">
            Generate
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Try it on your <span className="text-gradient">product</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">Upload one photo. We'll handle the rest.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Upload card */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-gradient-card border border-border/50 p-6 shadow-soft sticky top-24">
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="block group cursor-pointer"
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {preview ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-square bg-muted">
                    <img src={preview} alt="Product preview" className="h-full w-full object-contain" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreview("");
                        setFile(null);
                        setResult(null);
                      }}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 hover:bg-destructive hover:text-destructive-foreground grid place-items-center shadow-elegant transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-border group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors aspect-square grid place-items-center text-center p-6">
                    <div>
                      <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary/10 grid place-items-center mb-4">
                        <Upload className="h-7 w-7 text-primary" />
                      </div>
                      <div className="font-display font-bold text-lg">Drop your product photo</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        or click to browse · JPG/PNG · up to 10MB
                      </div>
                    </div>
                  </div>
                )}
              </label>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">
                    Notes <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Pack of 3, available in sizes M-XXL"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <button
                  onClick={generate}
                  disabled={loading || !preview}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-6 py-3.5 font-semibold shadow-elegant hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Meesho listing
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Takes ~15 sec · creates 3 image variants + full listing
                </p>
              </div>
            </div>
          </div>

          {/* Output */}
          <div id="result" className="lg:col-span-3">
            {!result && !loading && (
              <div className="h-full min-h-[400px] rounded-3xl border-2 border-dashed border-border grid place-items-center text-center p-12">
                <div>
                  <div className="mx-auto h-20 w-20 rounded-3xl bg-muted grid place-items-center mb-4">
                    <ImageIcon className="h-9 w-9 text-muted-foreground" />
                  </div>
                  <div className="font-display font-bold text-xl">Your listing will appear here</div>
                  <div className="text-muted-foreground mt-1">Upload a product photo to get started</div>
                </div>
              </div>
            )}

            {loading && (
              <div className="rounded-3xl bg-gradient-card border border-border/50 p-8 shadow-soft">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-muted animate-shimmer" />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="h-7 rounded-lg bg-muted animate-shimmer w-3/4" />
                  <div className="h-4 rounded-lg bg-muted animate-shimmer" />
                  <div className="h-4 rounded-lg bg-muted animate-shimmer w-5/6" />
                  <div className="h-4 rounded-lg bg-muted animate-shimmer w-4/6" />
                </div>
                <p className="text-sm text-muted-foreground mt-6 text-center">
                  Crafting your Meesho-ready listing — this usually takes 10–20 seconds…
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Images */}
                <div className="rounded-3xl bg-gradient-card border border-border/50 p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" /> Generated images
                    </h3>
                    <span className="text-xs text-muted-foreground">{result.images.length} variants</span>
                  </div>
                  {result.images.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-8 text-center">
                      Image generation didn't return results this time. Try again.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {result.images.map((src, i) => (
                        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-soft">
                          <img src={src} alt={`Variant ${i + 1}`} className="h-full w-full object-cover" />
                          <button
                            onClick={() => downloadImage(src, i)}
                            className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 grid place-items-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <span className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-4 py-2 text-sm font-semibold shadow-elegant">
                              <Download className="h-4 w-4" /> Download
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="rounded-3xl bg-gradient-card border border-border/50 p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-lg">Title</h3>
                    <CopyBtn text={result.listing.title} />
                  </div>
                  <textarea
                    defaultValue={result.listing.title}
                    rows={2}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {result.listing.title.length} chars · Meesho recommends ≤ 80
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-3xl bg-gradient-card border border-border/50 p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-lg">Description</h3>
                    <CopyBtn text={result.listing.description} />
                  </div>
                  <textarea
                    defaultValue={result.listing.description}
                    rows={5}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />

                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold">Key bullets</div>
                      <CopyBtn text={result.listing.bullets.map((b) => `• ${b}`).join("\n")} />
                    </div>
                    <ul className="space-y-2">
                      {result.listing.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-primary font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Meta */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="rounded-3xl bg-gradient-card border border-border/50 p-6 shadow-soft">
                    <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" /> Category & Tags
                    </h3>
                    <div className="text-sm font-semibold mb-3">{result.listing.category}</div>
                    <div className="flex flex-wrap gap-2">
                      {result.listing.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-gradient-card border border-border/50 p-6 shadow-soft">
                    <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-primary" /> Suggested price
                    </h3>
                    <div className="font-display text-3xl font-extrabold text-gradient">
                      ₹{result.listing.suggestedPriceInr.min} – ₹{result.listing.suggestedPriceInr.max}
                    </div>
                    <div className="mt-4 space-y-1.5 text-sm">
                      {Object.entries(result.listing.attributes).slice(0, 5).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2 border-b border-border/50 pb-1">
                          <span className="text-muted-foreground capitalize">{k}</span>
                          <span className="font-medium text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fullCopy);
                      toast.success("Full listing copied!");
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 font-semibold hover:bg-foreground/90 transition-colors"
                  >
                    <Copy className="h-4 w-4" /> Copy full listing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
