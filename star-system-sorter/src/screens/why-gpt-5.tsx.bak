import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Star, AlertCircle, Info, ChevronDown, ChevronRight, HelpCircle, Share2, Wand2 } from "lucide-react";

import { useBirthDataStore } from "@/store/birthDataStore";
import { useClassification } from "@/hooks/useClassification";
import { useLoreVersionCheck } from "@/hooks/useLoreVersionCheck";

import { Card } from "@/components/figma/Card";
import { Button } from "@/components/figma/Button";
import { SystemSummary } from "@/components/lore/SystemSummary";
import { ContributionCard } from "@/components/lore/ContributionCard";
// NOTE: We intentionally don't import FilterControls; this screen has its own lean filter UX.

import { loreBundle } from "@/lib/lore.bundle";
import { animationStyles } from "@/styles/animations";

/* ----------------------------- Local helpers ----------------------------- */

type SourceKey = "gate" | "channel" | "center" | "type" | "authority" | "profile" | "all";

const SOURCE_CHIPS: { key: SourceKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "gate", label: "Gates" },
  { key: "channel", label: "Channels" },
  { key: "center", label: "Centers" },
  { key: "type", label: "Type" },
  { key: "authority", label: "Authority" },
  { key: "profile", label: "Profile" },
];

function getRankedSystems(perc: Record<string, number>) {
  const entries = Object.entries(perc).sort((a, b) => b[1] - a[1]);
  const [first, second] = entries;
  const leadMargin = first && second ? first[1] - second[1] : 0;
  const primary = first?.[0] ?? "Unknown";
  const runnerUp = second?.[0];
  return { primary, runnerUp, leadMargin, ranked: entries };
}

function confidenceLabel(margin: number) {
  if (margin < 3) return "razor-thin";
  if (margin < 6) return "close";
  if (margin < 12) return "solid";
  return "clear";
}

function groupBySource(items: any[]) {
  const g: Record<string, any[]> = {};
  for (const it of items) {
    const k = it.source ?? "other";
    g[k] ??= [];
    g[k].push(it);
  }
  for (const key of Object.keys(g)) g[key].sort((a, b) => b.weight - a.weight);
  return g;
}

/* ------------------------------ Visual bits ------------------------------ */

const Starfield = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(48)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

function ResultCapsule(props: {
  primary: string;
  primaryPct: number;
  runnerUp?: string;
  leadMargin: number;
}) {
  const label = confidenceLabel(props.leadMargin);
  return (
    <Card variant="default">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg text-[var(--s3-lavender-200)]">Why {props.primary}?</h2>
            <span className="text-sm text-[var(--s3-text-subtle)]">{props.primaryPct.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-[var(--s3-text-subtle)]">
            Lead over {props.runnerUp ?? "others"}: {props.leadMargin.toFixed(1)} pts ({label})
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button size="sm" variant="ghost">
            <HelpCircle className="w-4 h-4 mr-2" />
            Glossary
          </Button>
        </div>
      </div>
    </Card>
  );
}

function StickyFilterChips(props: {
  value: SourceKey;
  onChange: (v: SourceKey) => void;
}) {
  return (
    <div
      className="sticky top-0 z-20 -mx-6 px-6 py-2 backdrop-blur-md bg-[var(--s3-canvas-dark)]/70 border-b border-[var(--s3-border-muted)]"
      role="toolbar"
      aria-label="Filter evidence by source"
    >
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {SOURCE_CHIPS.map((c) => {
          const active = props.value === c.key;
          return (
            <button
              key={c.key}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => props.onChange(c.key)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs min-h-[32px] transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s3-canvas-dark)]",
                active
                  ? "bg-[var(--s3-lavender-600)] text-white shadow-lg shadow-[var(--s3-lavender-600)]/20"
                  : "bg-[var(--s3-surface-subtle)] text-[var(--s3-text-subtle)] hover:bg-[var(--s3-surface-subtle)]/80",
              ].join(" ")}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DriverGroup({
  title,
  items,
  take = 3,
  id,
}: {
  title: string;
  items: any[];
  take?: number;
  id: string;
}) {
  const [open, setOpen] = useState(true);
  const top = items.slice(0, take);
  const rest = items.slice(take);
  return (
    <section id={id} className="animate-fade-in-up" aria-labelledby={`${id}-h`}>
      <div
        className="flex items-center justify-between mb-2 cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <h3 id={`${id}-h`} className="text-sm text-[var(--s3-lavender-200)]">
          {title}
        </h3>
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>

      {open && (
        <div className="space-y-3">
          {top.map((d, i) => (
            <CompactDriver key={`${d.identifier}-${i}`} item={d} />
          ))}

          {rest.length > 0 && (
            <details className="group">
              <summary className="list-none text-xs text-[var(--s3-text-subtle)] cursor-pointer hover:text-[var(--s3-lavender-200)]">
                Show {rest.length} more
              </summary>
              <div className="mt-2 space-y-3">
                {rest.map((d, i) => (
                  <CompactDriver key={`${d.identifier}-rest-${i}`} item={d} />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </section>
  );
}

function CompactDriver({ item }: { item: any }) {
  // item expected: { identifier, source, weight, system, rationale/description? }
  const label = `${item.source === "channel" ? "Channel" : item.source === "gate" ? "Gate" : (item.source ?? "Source")} ${item.identifier}`;
  const pct = item.weightPct ?? undefined;

  return (
    <Card variant="default">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[var(--s3-lavender-600)]/20 flex items-center justify-center flex-shrink-0">
          <Wand2 className="w-4 h-4 text-[var(--s3-lavender-400)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-[var(--s3-lavender-200)] truncate">{label}</p>
            <span className="text-xs text-[var(--s3-text-subtle)]">{item.weight?.toFixed(1)} pts</span>
          </div>
          <div className="mt-1 h-1.5 rounded bg-[var(--s3-surface-subtle)] overflow-hidden">
            <div
              className="h-1.5 bg-[var(--s3-lavender-500)]"
              style={{ width: `${Math.min(100, pct ?? Math.min(100, item.weight || 0))}%` }}
            />
          </div>
          {item.description && (
            <p className="mt-1.5 text-xs text-[var(--s3-text-subtle)] line-clamp-2">{item.description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------- Main Page ------------------------------- */

export default function WhyScreen() {
  const navigate = useNavigate();

  const classification = useBirthDataStore((s) => s.classification);
  const hdData = useBirthDataStore((s) => s.hdData);

  const loreVersionStatus = useLoreVersionCheck();
  const { recompute, isLoading } = useClassification();

  // Guard: need data
  if (!classification || !hdData) {
    navigate("/input");
    return null;
  }

  /* ---- Systems + confidence ---- */
  const { primary, runnerUp, leadMargin } = getRankedSystems(classification.percentages);
  const primarySystem =
    classification.classification === "hybrid" && classification.hybrid
      ? classification.hybrid[0]
      : classification.primary ?? primary;

  const availableSystems = useMemo(() => {
    const allies = (classification.allies ?? []).map((a: any) => a.system);
    return Array.from(new Set([primarySystem, ...allies]));
  }, [classification, primarySystem]);

  const [activeSystem, setActiveSystem] = useState<string>(primarySystem);
  const activePct = classification.percentages[activeSystem] ?? 0;

  /* ---- Evidence data ---- */
  const allForActive = classification.enhancedContributorsWithWeights?.[activeSystem] ?? [];
  const totalWeight = allForActive.reduce((s: number, c: any) => s + (c.weight || 0), 0);

  // compute weightPct for compact bars
  const contributors = allForActive.map((c: any) => ({
    ...c,
    weightPct: totalWeight ? (c.weight / totalWeight) * 100 : 0,
  }));

  const [sourceFilter, setSourceFilter] = useState<SourceKey>("all");

  const filtered = useMemo(() => {
    if (sourceFilter === "all") return contributors;
    return contributors.filter((c: any) => c.source === sourceFilter);
  }, [contributors, sourceFilter]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0)),
    [filtered]
  );

  /* ---- Top driver groups (progressive) ---- */
  const grouped = useMemo(() => groupBySource(sorted), [sorted]);

  /* ---- Virtualized ledger ---- */
  const shouldVirtualize = sorted.length > 75;
  const scrollParent = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => scrollParent.current,
    estimateSize: () => 120,
    overscan: 6,
    enabled: shouldVirtualize,
  });

  /* ---- Actions ---- */
  const handleRecompute = async () => {
    if (!hdData) return;
    await recompute(hdData);
  };

  /* ---- One-sentence rationale (quick story) ---- */
  const oneLine = useMemo(() => {
    const topChannels = grouped.channel?.slice(0, 1).map((x: any) => x.identifier);
    const topGates = grouped.gate?.slice(0, 2).map((x: any) => x.identifier);
    const parts: string[] = [];
    if (topChannels?.length) parts.push(`Channel ${topChannels.join(", ")}`);
    if (topGates?.length) parts.push(`Gates ${topGates.join(", ")}`);
    if (!parts.length) return `Result is driven by your ${activeSystem} indicators.`;
    return `${parts.join(" + ")} carry the most weight for ${activeSystem}.`;
  }, [grouped, activeSystem]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] relative overflow-hidden">
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.5} }
        ${animationStyles}
      `}</style>

      <Starfield />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl animate-glow-pulse" />

      <main className="relative max-w-md mx-auto w-full px-6 py-12 flex flex-col gap-6">
        {/* Header */}
        <header className="animate-fade-in-down">
          <button
            onClick={() => navigate("/result")}
            className="mb-3 min-h-[44px] px-3 py-2 text-[var(--s3-lavender-400)] hover:text-[var(--s3-lavender-300)] transition-all duration-300 hover:translate-x-[-4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s3-canvas-dark)] rounded-lg"
            aria-label="Go back to results"
          >
            ← Back
          </button>
          <p className="text-xs text-[var(--s3-text-subtle)]">Deterministic explanation</p>
        </header>

        {/* At-a-glance trust */}
        <div className="space-y-4">
          <ResultCapsule
            primary={primarySystem}
            primaryPct={classification.percentages[primarySystem] ?? 0}
            runnerUp={runnerUp}
            leadMargin={leadMargin}
          />

          {/* Compact All-systems bar (reuse your summary component) */}
          <SystemSummary classification={classification} />

          {/* One-sentence rationale */}
          <Card variant="default">
            <p className="text-xs text-[var(--s3-text-subtle)]">{oneLine}</p>
          </Card>
        </div>

        {/* Lore banner */}
        {loreVersionStatus.hasChanged && (
          <Card variant="warning">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--s3-gold-400)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Lore rules updated</p>
                <p className="text-xs text-[var(--s3-text-subtle)] mb-3">
                  Recompute using v{loreVersionStatus.currentVersion} to see the latest rationale.
                </p>
                <Button variant="primary" size="sm" onClick={handleRecompute} disabled={isLoading} className="w-full">
                  {isLoading ? "Recomputing…" : "Recompute with new lore"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Human Design quick facts */}
        <section aria-labelledby="hd-quick" className="space-y-3">
          <h2 id="hd-quick" className="text-xs text-[var(--s3-text-subtle)]">
            Your Human Design
          </h2>
          <div className="space-y-3">
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)]">Type: {hdData.type}</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Your energy type & strategy</p>
                </div>
              </div>
            </Card>
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)]">Profile: {hdData.profile}</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Your life theme & role</p>
                </div>
              </div>
            </Card>
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)]">Authority: {hdData.authority}</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Your decision-making</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* System tabs (primary + allies) */}
        {availableSystems.length > 1 && (
          <section className="space-y-2">
            <h2 className="text-xs text-[var(--s3-text-subtle)]">Explore systems</h2>
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Star system tabs">
              {availableSystems.map((sys) => {
                const active = sys === activeSystem;
                const pct = classification.percentages[sys] ?? 0;
                const isPrimary = sys === primarySystem;
                return (
                  <button
                    key={sys}
                    role="tab"
                    aria-selected={active}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setActiveSystem(sys)}
                    className={[
                      "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] min-w-[112px] transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s3-canvas-dark)]",
                      active
                        ? "bg-[var(--s3-lavender-600)] text-white shadow-lg shadow-[var(--s3-lavender-600)]/20 scale-[1.03]"
                        : "bg-[var(--s3-surface-subtle)] text-[var(--s3-text-subtle)] hover:bg-[var(--s3-surface-subtle)]/80",
                    ].join(" ")}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{sys}</span>
                      <span className={active ? "text-white/80 text-xs" : "text-[var(--s3-text-subtle)] text-xs"}>
                        {pct.toFixed(1)}%
                      </span>
                      {isPrimary && <span className="text-[var(--s3-gold-400)] text-[10px]">Primary</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Sticky filter chips */}
        <StickyFilterChips value={sourceFilter} onChange={setSourceFilter} />

        {/* Top Drivers (by source) */}
        <section aria-labelledby="drivers" className="space-y-5">
          <h2 id="drivers" className="text-xs text-[var(--s3-text-subtle)]">
            Top Drivers
          </h2>

          {grouped.channel?.length ? (
            <DriverGroup id="drivers-channel" title="Channels" items={grouped.channel} take={3} />
          ) : null}
          {grouped.gate?.length ? (
            <DriverGroup id="drivers-gate" title="Gates" items={grouped.gate} take={4} />
          ) : null}
          {grouped.center?.length ? (
            <DriverGroup id="drivers-center" title="Centers" items={grouped.center} take={3} />
          ) : null}
          {grouped.type?.length ? <DriverGroup id="drivers-type" title="Type" items={grouped.type} take={1} /> : null}
          {grouped.authority?.length ? (
            <DriverGroup id="drivers-auth" title="Authority" items={grouped.authority} take={1} />
          ) : null}
          {grouped.profile?.length ? (
            <DriverGroup id="drivers-prof" title="Profile" items={grouped.profile} take={1} />
          ) : null}

          {/* Runner-up explanation (simple, honest) */}
          {runnerUp && runnerUp !== activeSystem && activeSystem === primarySystem && (
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                  <Info className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Why not {runnerUp}?</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">
                    {runnerUp} shows some support, but the strongest weights favored {primarySystem} (see top drivers
                    above). The margin to {runnerUp} is {leadMargin.toFixed(1)} pts.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </section>

        {/* Evidence Ledger */}
        <section aria-labelledby="ledger" className="space-y-3">
          <h2 id="ledger" className="text-xs text-[var(--s3-text-subtle)]">
            All Evidence ({sorted.length})
          </h2>

          {sorted.length === 0 ? (
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                  <Info className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)] mb-1">No contributors for this filter</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Try switching to “All”.</p>
                </div>
              </div>
            </Card>
          ) : shouldVirtualize ? (
            <div ref={scrollParent} className="max-h-[600px] overflow-auto">
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((row) => (
                  <div
                    key={row.key}
                    className="absolute top-0 left-0 w-full"
                    style={{ transform: `translateY(${row.start}px)` }}
                  >
                    <div className="pb-3">
                      <ContributionCard
                        contributor={sorted[row.index]}
                        totalWeight={totalWeight}
                        systemId={activeSystem}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((c, i) => (
                <ContributionCard key={`${c.identifier}-${i}`} contributor={c} totalWeight={totalWeight} systemId={activeSystem} />
              ))}
            </div>
          )}
        </section>

        {/* Footer / alignment */}
        <div className="pt-2">
          <p className="text-xs text-center text-[var(--s3-text-subtle)]">
            Total alignment: {activePct.toFixed(1)}% {activeSystem}
          </p>
        </div>

        {/* Lore + disclaimer */}
        <footer className="mt-auto pt-4 space-y-3">
          <p className="text-center text-xs text-[var(--s3-text-subtle)]">
            Lore v{loreBundle.lore_version} •{" "}
            {classification.classification === "hybrid" && classification.hybrid
              ? `${classification.hybrid[0]} + ${classification.hybrid[1]} (Δ${Math.abs(
                  classification.percentages[classification.hybrid[0]] -
                    classification.percentages[classification.hybrid[1]]
                ).toFixed(1)}%)`
              : "Deterministic rules engine"}{" "}
            • For insight & entertainment
          </p>
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
              For insight & entertainment. Not medical, financial, or legal advice.
            </p>
          </div>
        </footer>

        <div className="h-8" />
      </main>
    </div>
  );
}
