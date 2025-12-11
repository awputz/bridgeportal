import { Building2, TrendingUp, MapPin, CheckCircle2, Layers, Store, Hammer, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBridgeBoroughs, useBridgeAssetTypes, type BoroughMetadata, type AssetTypeMetadata } from "@/hooks/useBridgeMarkets";
import { Skeleton } from "@/components/ui/skeleton";

// Icon mapping for asset types
const assetIcons: Record<string, typeof Building2> = {
  Building2,
  Layers,
  Store,
  Building: Building2,
  Hammer,
  Sparkles,
  TrendingUp,
};

const Markets = () => {
  const { data: boroughs, isLoading: boroughsLoading } = useBridgeBoroughs();
  const { data: assetTypes, isLoading: assetTypesLoading } = useBridgeAssetTypes();

  return (
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-20 md:mb-24 lg:mb-28 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-10 lg:mb-12 tracking-tight">Markets & Asset Types</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            Comprehensive coverage across NYC boroughs with specialized expertise in middle-market investment properties
          </p>
        </div>

        {/* NYC Boroughs Coverage */}
        <section className="mb-24 md:mb-32 lg:mb-40">
          <h2 className="text-3xl md:text-4xl font-light mb-16 md:mb-20 lg:mb-24">NYC Coverage</h2>
          {boroughsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
              {boroughs?.map((borough) => {
                const meta = borough.metadata as BoroughMetadata | null;
                return (
                  <div 
                    key={borough.id}
                    className="p-8 md:p-10 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04] hover:transform hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <MapPin className="text-accent flex-shrink-0" size={32} />
                      <div>
                        <h3 className="text-2xl md:text-3xl font-light mb-2">{borough.name}</h3>
                        <p className="text-sm md:text-base text-muted-foreground font-light">{borough.description}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    {meta?.stats && (
                      <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg bg-white/[0.02]">
                        <div>
                          <div className="text-xs text-muted-foreground font-light mb-1">Avg Price/Unit</div>
                          <div className="text-sm font-light">{meta.stats.avgPricePerUnit}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-light mb-1">Cap Rate Range</div>
                          <div className="text-sm font-light">{meta.stats.capRate}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-light mb-1">Career Volume</div>
                          <div className="text-sm font-light">{meta.stats.volume}</div>
                        </div>
                      </div>
                    )}

                    {/* Neighborhoods */}
                    {meta?.neighborhoods && (
                      <div>
                        <h4 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Key Neighborhoods</h4>
                        <div className="flex flex-wrap gap-2">
                          {meta.neighborhoods.map((neighborhood, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 font-light"
                            >
                              {neighborhood}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Asset Types */}
        <section className="mb-24 md:mb-32 lg:mb-40">
          <h2 className="text-3xl md:text-4xl font-light mb-16 md:mb-20 lg:mb-24">Asset Type Expertise</h2>
          {assetTypesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
              {assetTypes?.map((asset) => {
                const meta = asset.metadata as AssetTypeMetadata | null;
                const Icon = meta?.icon ? (assetIcons[meta.icon] || Building2) : Building2;
                return (
                  <div 
                    key={asset.id}
                    className="p-8 md:p-10 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="text-accent" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-light mb-1">{asset.name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground font-light">{meta?.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base text-muted-foreground font-light mb-6 leading-relaxed">
                      {asset.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {meta?.highlights && (
                        <div>
                          <h4 className="text-xs font-light uppercase tracking-wider text-muted-foreground mb-3">Key Focus Areas</h4>
                          <ul className="space-y-2">
                            {meta.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs md:text-sm font-light">
                                <CheckCircle2 size={14} className="mt-0.5 text-accent flex-shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {meta?.buyers && (
                        <div>
                          <h4 className="text-xs font-light uppercase tracking-wider text-muted-foreground mb-3">Typical Buyer Profile</h4>
                          <p className="text-xs md:text-sm font-light text-muted-foreground leading-relaxed">
                            {meta.buyers.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Market Intelligence CTA */}
        <section className="p-8 md:p-12 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready to Discuss Your Asset?</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Whether you're considering a sale, exploring market conditions, or seeking a valuation, our team provides data-driven guidance tailored to your asset and objectives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-light px-8 md:px-12">
              <Link to="/submit-deal">Submit Your Property</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8 md:px-12">
              <Link to="/transactions">View Recent Sales</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Markets;
