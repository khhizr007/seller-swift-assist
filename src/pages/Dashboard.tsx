import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { History, Images, Loader2, Lock, MessageSquareText, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthDialog } from "@/components/AuthDialog";
import { Header } from "@/components/Header";
import { ListingResultView } from "@/components/ListingResultView";
import { useAuth } from "@/hooks/use-auth";
import { getSavedGenerations } from "@/lib/prototype-storage";
import type { SavedGeneration } from "@/types/prototype";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const [items, setItems] = useState<SavedGeneration[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = getSavedGenerations(user.id);
    setItems(data);
    setSelectedId(searchParams.get("generation") ?? data[0]?.id ?? null);
    setLoading(false);
  }, [authLoading, searchParams, user]);

  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const totalImages = items.reduce((sum, item) => sum + item.result.images.length, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-24">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your dashboard…
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pb-20">
          <section className="relative overflow-hidden border-b border-border/50 py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_45%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_35%)]" />
            <div className="container relative">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <History className="h-3.5 w-3.5" /> Dashboard
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                  Your saved <span className="text-gradient">Meesho listing history</span>
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                  Revisit every generated image set, listing idea, and pricing suggestion without rebuilding from scratch.
                </p>
              </div>
            </div>
          </section>

          {!user ? (
            <section className="container py-16">
              <div className="mx-auto max-w-3xl rounded-[2rem] border border-border/60 bg-gradient-card p-8 shadow-soft md:p-12">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-extrabold">Login to open your saved workspace</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  This prototype dashboard stores your generated images and listing insights locally in your browser.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="inline-flex items-center rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow"
                  >
                    Open prototype login
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center rounded-full border border-border/70 bg-background px-6 py-3 font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Back to generator
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section id="history" className="container py-12">
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
                  <div className="text-sm text-muted-foreground">Saved listings</div>
                  <div className="font-display mt-2 text-3xl font-extrabold">{items.length}</div>
                </div>
                <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
                  <div className="text-sm text-muted-foreground">Generated images</div>
                  <div className="font-display mt-2 text-3xl font-extrabold">{totalImages}</div>
                </div>
                <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
                  <div className="text-sm text-muted-foreground">Latest activity</div>
                  <div className="mt-2 text-sm font-semibold">
                    {items[0]?.createdAt ? formatDistanceToNow(new Date(items[0].createdAt), { addSuffix: true }) : "No generations yet"}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-3xl border border-border/50 bg-gradient-card p-16 text-muted-foreground shadow-soft">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading your history…
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-[2rem] border border-border/50 bg-gradient-card p-10 text-center shadow-soft">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-2xl font-extrabold">No saved listings yet</h2>
                  <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                    Generate your first listing from the home page and it will appear here automatically.
                  </p>
                  <Link
                    to="/#generate"
                    className="mt-6 inline-flex items-center rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow"
                  >
                    Create a listing
                  </Link>
                </div>
              ) : (
                <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <aside className="space-y-4">
                    {items.map((item) => {
                      const isActive = item.id === selected?.id;
                      const listing = item.result.listing;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`w-full rounded-3xl border p-5 text-left shadow-soft transition-all ${
                            isActive
                              ? "border-primary/40 bg-primary/5 ring-2 ring-primary/20"
                              : "border-border/50 bg-gradient-card hover:border-primary/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="line-clamp-2 font-display text-lg font-bold">{listing.title}</div>
                              <div className="mt-2 text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                            <div className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-primary">
                              {item.result.images.length} img
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1">
                              <Images className="h-3.5 w-3.5" />
                              {listing.category}
                            </span>
                            {item.sourceNotes && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1">
                                <MessageSquareText className="h-3.5 w-3.5" />
                                Notes saved
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </aside>

                  <div>
                    {selected && (
                      <>
                        <div className="mb-6 rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Saved listing</div>
                              <div className="mt-1 font-display text-2xl font-extrabold">{selected.result.listing.title}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Created {formatDistanceToNow(new Date(selected.createdAt), { addSuffix: true })}
                            </div>
                          </div>

                          {(selected.sourceCategory || selected.sourceNotes || selected.sourceFilename) && (
                            <div className="mt-5 grid gap-3 md:grid-cols-3">
                              <div className="rounded-2xl bg-background p-4">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">Category hint</div>
                                <div className="mt-1 text-sm font-semibold">{selected.sourceCategory ?? "Auto-detect"}</div>
                              </div>
                              <div className="rounded-2xl bg-background p-4">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">Uploaded file</div>
                                <div className="mt-1 text-sm font-semibold">{selected.sourceFilename ?? "Not stored"}</div>
                              </div>
                              <div className="rounded-2xl bg-background p-4">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">Seller notes</div>
                                <div className="mt-1 text-sm font-semibold">{selected.sourceNotes ?? "None provided"}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <ListingResultView result={selected.result} />
                      </>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Dashboard;
