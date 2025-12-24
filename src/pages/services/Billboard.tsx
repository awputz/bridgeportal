import { Building2, Eye, Clock, ArrowRight, Megaphone, TrendingUp, Users, MapPin, Store, Briefcase, Home, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import billboardHero from "@/assets/bridge-billboard-hero.png";
import { MobileStickyContact } from "@/components/MobileStickyContact";

export default function Billboard() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const termsReveal = useScrollReveal(0.1);
  const clientsReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen bg-background">
      <ServicesSubNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 md:pb-14 lg:pb-16 border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={heroReveal.elementRef}
            className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-5 tracking-tight">
                Bridge Billboard
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-xl">
                Direct landlord access to NYC's most visible outdoor advertising inventory across all five boroughs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  size="default"
                  className="group"
                  onClick={openContactSheet}
                >
                  View Inventory
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={openContactSheet}
                >
                  Request Rates
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-square rounded-lg overflow-hidden">
              <img 
                src={billboardHero}
                alt="Bridge Billboard - NYC Outdoor Advertising"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="absolute bottom-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
                50+ Premium Locations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section 
        ref={statsReveal.elementRef}
        className={`py-8 md:py-10 bg-muted/30 border-b border-border/10 transition-all duration-700 ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">50+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Board Locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">100M+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Monthly Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">5</div>
              <div className="text-xs md:text-sm text-muted-foreground">NYC Boroughs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">Direct</div>
              <div className="text-xs md:text-sm text-muted-foreground">LL Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section 
        ref={introReveal.elementRef}
        className={`py-10 md:py-12 lg:py-16 border-b border-border/10 transition-all duration-700 ${introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Megaphone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                Out-of-Home Advertising in New York
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
              Bridge Billboard connects brands and advertisers directly with premium outdoor advertising inventory across New York City. Through long-standing relationships with landlords and property owners, Bridge offers access to high-visibility placements that are often unavailable through traditional channels.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Whether you're launching a campaign, building brand awareness, or targeting specific neighborhoods, Bridge Billboard provides the inventory, strategy, and execution support to make your out-of-home advertising work harder.
            </p>
          </div>
        </div>
      </section>

      {/* Flexible Terms & Process Section */}
      <section 
        ref={termsReveal.elementRef}
        className={`py-10 md:py-14 lg:py-16 border-b border-border/10 transition-all duration-700 ${termsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            <div className="border border-border/30 rounded-lg p-5 md:p-6 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  Flexible Terms
                </h3>
              </div>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                We work with clients to structure agreements that match campaign objectives and budgets.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm md:text-base">Short-term campaigns from 1 month</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm md:text-base">Annual placements with volume discounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm md:text-base">Seasonal and event-based campaigns</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border/30 rounded-lg p-5 md:p-6 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  Our Process
                </h3>
              </div>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                From inquiry to installation, we handle the details.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm md:text-base">Location selection and availability check</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm md:text-base">Creative sizing and production coordination</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm md:text-base">Installation and campaign monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Client Types Section */}
      <section 
        ref={clientsReveal.elementRef}
        className={`py-10 md:py-14 lg:py-16 border-b border-border/10 transition-all duration-700 ${clientsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              Who We Work With
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div className="border border-border/30 rounded-lg p-5 md:p-6 hover:border-primary/20 transition-colors">
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Brands & Agencies</h3>
              <p className="text-sm text-muted-foreground">National brands and creative agencies seeking high-impact NYC placements</p>
            </div>
            
            <div className="border border-border/30 rounded-lg p-5 md:p-6 hover:border-primary/20 transition-colors">
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3">
                <Store className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Local Businesses</h3>
              <p className="text-sm text-muted-foreground">Regional businesses and startups building neighborhood awareness</p>
            </div>
            
            <div className="border border-border/30 rounded-lg p-5 md:p-6 hover:border-primary/20 transition-colors">
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3">
                <Home className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Real Estate</h3>
              <p className="text-sm text-muted-foreground">Developers and property owners promoting new projects</p>
            </div>
            
            <div className="border border-border/30 rounded-lg p-5 md:p-6 hover:border-primary/20 transition-colors">
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Entertainment</h3>
              <p className="text-sm text-muted-foreground">Film, TV, and event promotions across the city</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaReveal.elementRef}
        className={`py-12 md:py-16 lg:py-20 transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Go Big?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              Contact Bridge Billboard to learn about available inventory and campaign opportunities.
            </p>
            <Button 
              size="default"
              className="group"
              onClick={openContactSheet}
            >
              Contact Billboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      <MobileStickyContact onContactClick={openContactSheet} />
    </div>
  );
}