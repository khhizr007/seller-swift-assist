import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Clock3, FolderOpen, ImagePlus, Images, Sparkles, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { Generator } from "@/components/Generator";
import { getSavedGenerations } from "@/lib/prototype-storage";
import { useAuth } from "@/hooks/use-auth";

export const WorkspaceHome = () => {
  const { user } = useAuth();
  const items = user ? getSavedGenerations(user.id) : [];
  const totalImages = items.reduce((sum, item) => sum + item.result.images.length, 0);
  const latestItem = items[0] ?? null;
  const firstName = user?.name?.split(/[\s._-]+/)[0] || "Seller";

  return (
    <main className="flex-1 pb-20">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_38%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_32%)]" />
        <div className="container relative py-14 md:py-16">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Workspace
              </div>
              <h1 className="font-display max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
                Welcome back, <span className="text-gradient">{firstName}</span>.
                <br />
                Ship your next Meesho listing faster.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Start a fresh product listing, reuse what worked recently, and keep every image set and listing insight in one workspace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#workspace-generate"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-elegant transition-all hover:shadow-glow"
                >
                  <ImagePlus className="h-4 w-4" /> New listing
                </a>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-6 py-3.5 font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <FolderOpen className="h-4 w-4" /> Open library
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-border/50 bg-background/80 p-5 shadow-soft backdrop-blur">
                  <div className="text-sm text-muted-foreground">Saved listings</div>
                  <div className="font-display mt-2 text-3xl font-extrabold">{items.length}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Your reusable catalog drafts</div>
                </div>
                <div className="rounded-3xl border border-border/50 bg-background/80 p-5 shadow-soft backdrop-blur">
                  <div className="text-sm text-muted-foreground">Generated images</div>
                  <div className="font-display mt-2 text-3xl font-extrabold">{totalImages}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Studio, lifestyle, and infographic variants</div>
                </div>
                <div className="rounded-3xl border border-border/50 bg-background/80 p-5 shadow-soft backdrop-blur">
                  <div className="text-sm text-muted-foreground">Latest activity</div>
                  <div className="mt-2 text-sm font-semibold">
                    {latestItem ? formatDistanceToNow(new Date(latestItem.createdAt), { addSuffix: true }) : "No generations yet"}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Your workspace updates automatically after each run</div>
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-border/50 bg-gradient-card p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Recent library</div>
                  <div className="text-xs text-muted-foreground">Pick up from your latest work</div>
                </div>
                <Link to="/dashboard" className="text-sm font-semibold text-primary hover:text-primary/80">
                  View all
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {items.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    to={`/dashboard?generation=${item.id}`}
                    className="block rounded-2xl border border-border/50 bg-background p-3 transition-all hover:border-primary/30 hover:shadow-soft"
                  >
                    <div className="flex gap-3">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-muted">
                        {item.result.images[0] ? (
                          <img src={item.result.images[0]} alt={item.result.listing.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-muted-foreground">
                            <Images className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-sm font-semibold">{item.result.listing.title}</div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {items.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
                    Your latest generated listings will appear here for quick access.
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-3xl bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Tags className="h-4 w-4 text-primary" /> Workflow tip
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add pack size, fabric, or size-range notes before generating. Your saved library becomes much easier to scan later.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
            <div className="text-xs font-bold uppercase tracking-wide text-primary">Create</div>
            <h2 className="font-display mt-3 text-2xl font-extrabold">Generate a fresh listing</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Upload one product photo and generate images, copy, tags, and price suggestions in one pass.
            </p>
            <a href="#workspace-generate" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Start now <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
            <div className="text-xs font-bold uppercase tracking-wide text-primary">Organize</div>
            <h2 className="font-display mt-3 text-2xl font-extrabold">Keep your winning drafts</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every logged-in generation is saved automatically so you can revisit images and insights without starting over.
            </p>
            <Link to="/dashboard" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Open saved library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-border/50 bg-gradient-card p-6 shadow-soft">
            <div className="text-xs font-bold uppercase tracking-wide text-primary">Move faster</div>
            <h2 className="font-display mt-3 text-2xl font-extrabold">Stay in creation mode</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your signed-in home is built for repeat work, with quick actions and recent outputs instead of landing-page content.
            </p>
            <Link to="/dashboard" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Review your recents <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div id="workspace-generate">
        <Generator mode="workspace" />
      </div>
    </main>
  );
};
