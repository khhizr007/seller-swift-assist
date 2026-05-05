import { Check, Copy, Download, ImageIcon, IndianRupee, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ListingResult } from "@/types/listing";

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
      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
};

const downloadImage = async (url: string, idx: number) => {
  try {
    const blob = await (await fetch(url)).blob();
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `meesho-image-${idx + 1}.png`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  } catch {
    toast.error("Could not download image");
  }
};

export const ListingResultView = ({
  result,
  showAnimation = false,
}: {
  result: ListingResult;
  showAnimation?: boolean;
}) => {
  const fullCopy = `${result.listing.title}\n\n${result.listing.description}\n\n${result.listing.bullets
    .map((bullet) => `• ${bullet}`)
    .join("\n")}\n\nTags: ${result.listing.tags.join(", ")}\nCategory: ${result.listing.category}\nPrice: ₹${result.listing.suggestedPriceInr.min}–₹${result.listing.suggestedPriceInr.max}`;

  return (
    <div className={`space-y-6 ${showAnimation ? "animate-fade-in-up" : ""}`}>
      <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display flex items-center gap-2 text-lg font-bold">
            <ImageIcon className="h-5 w-5 text-primary" /> Generated images
          </h3>
          <span className="text-xs text-muted-foreground">{result.images.length} variants</span>
        </div>
        {result.images.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Image generation didn't return results this time. Try again.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {result.images.map((src, index) => (
              <div key={`${src}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-soft">
                <img src={src} alt={`Variant ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  onClick={() => downloadImage(src, index)}
                  className="absolute inset-0 grid place-items-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/40 group-hover:opacity-100"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-elegant">
                    <Download className="h-4 w-4" /> Download
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Title</h3>
          <CopyBtn text={result.listing.title} />
        </div>
        <textarea
          readOnly
          value={result.listing.title}
          rows={2}
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-2 text-xs text-muted-foreground">{result.listing.title.length} chars · Meesho recommends ≤ 80</div>
      </div>

      <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Description</h3>
          <CopyBtn text={result.listing.description} />
        </div>
        <textarea
          readOnly
          value={result.listing.description}
          rows={5}
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold">Key bullets</div>
            <CopyBtn text={result.listing.bullets.map((bullet) => `• ${bullet}`).join("\n")} />
          </div>
          <ul className="space-y-2">
            {result.listing.bullets.map((bullet, index) => (
              <li key={`${bullet}-${index}`} className="flex gap-2 text-sm">
                <span className="font-bold text-primary">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
          <h3 className="font-display mb-3 flex items-center gap-2 text-lg font-bold">
            <Tag className="h-5 w-5 text-primary" /> Category & Tags
          </h3>
          <div className="mb-3 text-sm font-semibold">{result.listing.category}</div>
          <div className="flex flex-wrap gap-2">
            {result.listing.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
          <h3 className="font-display mb-3 flex items-center gap-2 text-lg font-bold">
            <IndianRupee className="h-5 w-5 text-primary" /> Suggested price
          </h3>
          <div className="font-display text-gradient text-3xl font-extrabold">
            ₹{result.listing.suggestedPriceInr.min} – ₹{result.listing.suggestedPriceInr.max}
          </div>
          <div className="mt-4 space-y-1.5 text-sm">
            {Object.entries(result.listing.attributes).slice(0, 5).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-2 border-b border-border/50 pb-1">
                <span className="capitalize text-muted-foreground">{key}</span>
                <span className="text-right font-medium">{value}</span>
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
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          <Copy className="h-4 w-4" /> Copy full listing
        </button>
      </div>
    </div>
  );
};
