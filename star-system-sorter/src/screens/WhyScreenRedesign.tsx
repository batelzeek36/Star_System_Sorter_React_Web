import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBirthDataStore } from "@/store/birthDataStore";
import {
  ChevronLeft,
  Sparkles,
  Orbit,
  GitBranch,
  Cpu,
  Target,
  User,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/figma/Button";
import { Card } from "@/components/figma/Card";
import { Chip } from "@/components/figma/Chip";

// Mock data types
interface Contribution {
  source: "gate" | "channel" | "center" | "type" | "authority" | "profile";
  identifier: string;
  system: string;
  points: number;
  percentage: number;
  description?: string;
}

interface ClassificationResult {
  classification: "primary" | "hybrid" | "unresolved";
  primary: string;
  secondary?: string;
  percentages: { [system: string]: number };
  contributions: Contribution[];
}

// Mock data from the screenshot
const mockResult: ClassificationResult = {
  classification: "primary",
  primary: "Orion",
  percentages: {
    Orion: 28.8,
    Sirius: 22.3,
    Pleiades: 18.5,
    Andromeda: 14.2,
    Lyra: 10.1,
    Arcturus: 6.1,
  },
  contributions: [
    {
      source: "channel",
      identifier: "Channel 10-34",
      system: "Orion",
      points: 15,
      percentage: 20.0,
      description: "The Channel of Exploration • Behavior / Power",
    },
    {
      source: "channel",
      identifier: "Channel 25-51",
      system: "Orion",
      points: 14,
      percentage: 18.1,
      description: "The Channel of Initiation • Universal Love / Shock",
    },
    {
      source: "gate",
      identifier: "Gate 13",
      system: "Orion",
      points: 3,
      percentage: 3.7,
      description: "The Listener • Direction / Fellowship of Man",
    },
    {
      source: "gate",
      identifier: "Gate 18",
      system: "Orion",
      points: 8,
      percentage: 10.1,
      description: "Correction • Correction of Patterns",
    },
    {
      source: "gate",
      identifier: "Gate 52",
      system: "Orion",
      points: 8,
      percentage: 10.0,
      description: "Inaction / Stillness • The Gate of Keeping Still Mountain",
    },
    {
      source: "gate",
      identifier: "Gate 64",
      system: "Orion",
      points: 5,
      percentage: 5.7,
      description: "Confusion • Before Completion",
    },
    {
      source: "center",
      identifier: "Undefined Sacral",
      system: "Orion",
      points: 6,
      percentage: 7.5,
      description: "Open to external life force energy",
    },
    {
      source: "center",
      identifier: "Undefined Solar Plexus",
      system: "Orion",
      points: 6,
      percentage: 7.5,
      description: "Amplifies and samples emotional waves",
    },
    {
      source: "type",
      identifier: "Projector",
      system: "Orion",
      points: 10,
      percentage: 12.5,
      description: "Non-energy type designed to guide others",
    },
  ],
};

const STAR_SYSTEMS = [
  "Orion",
  "Sirius",
  "Pleiades",
  "Andromeda",
  "Lyra",
  "Arcturus",
];

const SYSTEM_COLORS: { [key: string]: string } = {
  Orion: "#a78bfa",
  Sirius: "#60a5fa",
  Pleiades: "#f472b6",
  Andromeda: "#34d399",
  Lyra: "#fbbf24",
  Arcturus: "#fb923c",
};

const SOURCE_ICONS = {
  gate: Target,
  channel: GitBranch,
  center: Cpu,
  type: User,
  authority: Sparkles,
  profile: Brain,
};

const SOURCE_LABELS = {
  gate: "Gate",
  channel: "Channel",
  center: "Energy Center",
  type: "Type",
  authority: "Authority",
  profile: "Profile",
};

export default function WhyScreenRedesign() {
  const [result] = useState<ClassificationResult>(mockResult);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [animatedPercentages, setAnimatedPercentages] = useState<{
    [key: string]: number;
  }>({});

  // Animate percentage bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated: { [key: string]: number } = {};
      Object.keys(result.percentages).forEach((system) => {
        animated[system] = result.percentages[system];
      });
      setAnimatedPercentages(animated);
    }, 100);
    return () => clearTimeout(timer);
  }, [result.percentages]);

  // Group contributions by source
  const groupedContributions = result.contributions.reduce(
    (acc, contribution) => {
      if (!acc[contribution.source]) {
        acc[contribution.source] = [];
      }
      acc[contribution.source].push(contribution);
      return acc;
    },
    {} as { [key: string]: Contribution[] }
  );

  // Sort systems by percentage
  const sortedSystems = STAR_SYSTEMS.map((system) => ({
    name: system,
    percentage: result.percentages[system] || 0,
  })).sort((a, b) => b.percentage - a.percentage);

  // Calculate total points
  const totalPoints = result.contributions.reduce(
    (sum, c) => sum + c.points,
    0
  );

  // Filter contributions
  const filteredContributions =
    selectedFilter === "all"
      ? result.contributions
      : result.contributions.filter((c) => c.source === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0f2e] to-[#0a0118] text-white">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes shimmer {
          0% {
            background-position: -150% center;
          }
          100% {
            background-position: 250% center;
          }
        }
        .holographic-shimmer {
          color: #a78bfa;
          background: linear-gradient(
            110deg,
            #a78bfa 0%,
            #a78bfa 45%,
            #e9d5ff 50%,
            #a78bfa 55%,
            #a78bfa 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 8s linear infinite;
        }
      `}</style>
      {/* Animated starfield background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 80%, white, transparent)`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 pt-6 pb-4">
        <button
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Results</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Orbit className="w-8 h-8 text-violet-400" />
          <h1 className="text-white/90">Your Classification Explained</h1>
        </div>
        <p className="text-white/60 text-sm">
          Understand how your Human Design chart maps to your star system
        </p>
      </div>

      {/* Hero Section - Primary Result */}
      <div
        className="relative z-10 px-4 py-6 animate-fade-in-up"
        style={{ animationDelay: "0.1s", opacity: 0 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-transparent border border-violet-500/30 p-6">
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="text-sm text-violet-300">
                Primary Classification
              </span>
            </div>
            <h2 className="text-white mb-2">{result.primary}</h2>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold holographic-shimmer">
                {result.percentages[result.primary]}%
              </span>
              <span className="text-white/60">alignment</span>
            </div>
            <p className="text-white/70 text-sm">
              Based on {result.contributions.length} contributing factors from
              your Human Design chart
            </p>
          </div>
        </div>
      </div>

      {/* System Distribution - Orbital View */}
      <div
        className="relative z-10 px-4 py-6 animate-fade-in-up"
        style={{ animationDelay: "0.2s", opacity: 0 }}
      >
        <h3 className="text-white/90 mb-4">Star System Distribution</h3>
        <div className="space-y-3">
          {sortedSystems.map((system, index) => {
            const isPrimary = system.name === result.primary;
            return (
              <div key={system.name} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: SYSTEM_COLORS[system.name],
                        boxShadow: `0 0 8px ${SYSTEM_COLORS[system.name]}50`,
                      }}
                    />
                    <span
                      className={`text-sm ${
                        isPrimary ? "text-white" : "text-white/70"
                      }`}
                    >
                      {system.name}
                    </span>
                    {isPrimary && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-300">
                        Primary
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isPrimary ? "text-violet-400" : "text-white/60"
                    }`}
                  >
                    {system.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${animatedPercentages[system.name] || 0}%`,
                      backgroundColor: SYSTEM_COLORS[system.name],
                      boxShadow: `0 0 12px ${SYSTEM_COLORS[system.name]}50`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div
        className="relative z-10 px-4 py-6 animate-fade-in-up"
        style={{ animationDelay: "0.3s", opacity: 0 }}
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-2xl text-violet-400 mb-1">
              {result.contributions.length}
            </div>
            <div className="text-xs text-white/60">Factors</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-2xl text-violet-400 mb-1">{totalPoints}</div>
            <div className="text-xs text-white/60">Total Points</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-2xl text-violet-400 mb-1">
              {Object.keys(groupedContributions).length}
            </div>
            <div className="text-xs text-white/60">Categories</div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div
        className="relative z-10 py-4 overflow-hidden px-4 animate-fade-in-up"
        style={{ animationDelay: "0.4s", opacity: 0 }}
      >
        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex-shrink-0 snap-start ${
              selectedFilter === "all"
                ? "bg-violet-500 text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            All ({result.contributions.length})
          </button>
          {Object.entries(groupedContributions).map(
            ([source, contributions]) => {
              const Icon = SOURCE_ICONS[source as keyof typeof SOURCE_ICONS];
              return (
                <button
                  key={source}
                  onClick={() => setSelectedFilter(source)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex-shrink-0 snap-start ${
                    selectedFilter === source
                      ? "bg-violet-500 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {SOURCE_LABELS[source as keyof typeof SOURCE_LABELS]} (
                  {contributions.length})
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Contributing Factors - Accordion Style */}
      <div
        className="relative z-10 px-4 py-6 animate-fade-in-up"
        style={{ animationDelay: "0.5s", opacity: 0 }}
      >
        <h3 className="text-white/90 mb-4">Contributing Factors</h3>

        {selectedFilter === "all" ? (
          <Accordion type="multiple" className="space-y-3">
            {Object.entries(groupedContributions).map(
              ([source, contributions]) => {
                const Icon = SOURCE_ICONS[source as keyof typeof SOURCE_ICONS];
                const totalCategoryPoints = contributions.reduce(
                  (sum, c) => sum + c.points,
                  0
                );

                return (
                  <AccordionItem
                    key={source}
                    value={source}
                    className="border-0 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/30 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline transition-all duration-200 w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-violet-400" />
                          </div>
                          <div className="text-left">
                            <div className="text-white text-sm">
                              {
                                SOURCE_LABELS[
                                  source as keyof typeof SOURCE_LABELS
                                ]
                              }
                            </div>
                            <div className="text-white/60 text-xs">
                              {contributions.length} factor
                              {contributions.length !== 1 ? "s" : ""} •{" "}
                              {totalCategoryPoints} points
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-white/40 transition-transform duration-200" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="space-y-3 pt-2">
                        {contributions.map((contribution, idx) => (
                          <div
                            key={idx}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-200 hover:shadow-md hover:shadow-violet-500/10 cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="text-white text-sm mb-1">
                                  {contribution.identifier}
                                </div>
                                {contribution.description && (
                                  <div className="text-white/60 text-xs">
                                    {contribution.description}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-violet-400 text-sm">
                                  +{contribution.points}
                                </div>
                                <div className="text-white/50 text-xs">
                                  {contribution.percentage}%
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      SYSTEM_COLORS[contribution.system],
                                  }}
                                />
                                <span className="text-xs text-white/70">
                                  → {contribution.system}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }
            )}
          </Accordion>
        ) : (
          <div className="space-y-3 pb-1">
            {filteredContributions.map((contribution, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {(() => {
                        const Icon = SOURCE_ICONS[contribution.source];
                        return <Icon className="w-4 h-4 text-violet-400" />;
                      })()}
                      <div className="text-white text-sm">
                        {contribution.identifier}
                      </div>
                    </div>
                    {contribution.description && (
                      <div className="text-white/60 text-xs">
                        {contribution.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-violet-400 text-sm">
                      +{contribution.points}
                    </div>
                    <div className="text-white/50 text-xs">
                      {contribution.percentage}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: SYSTEM_COLORS[contribution.system],
                      }}
                    />
                    <span className="text-xs text-white/70">
                      Contributes to {contribution.system}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legal Disclaimer */}
      <div
        className="relative z-10 px-4 py-8 animate-fade-in-up"
        style={{ animationDelay: "0.6s", opacity: 0 }}
      >
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-white/50 text-center">
            For insight & entertainment. Not medical, financial, or legal
            advice.
          </p>
        </div>
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-24" />
    </div>
  );
}
