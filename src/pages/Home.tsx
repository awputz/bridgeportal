import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListingCard } from "@/components/ListingCard";
import { mockListings } from "@/data/mockListings";
import { ArrowRight, Search, Building2, MapPin, List, Handshake } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { ListingCardSkeletonGrid } from "@/components/skeletons/ListingCardSkeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroBg from "@/assets/brooklyn-bridge-hero.jpg";
import bridgeLogoWhite from "@/assets/bridge-logo-white.png";
import manhattanMarket from "@/assets/manhattan-market.jpg";
import brooklynMarket from "@/assets/brooklyn-market.jpg";
import queensMarket from "@/assets/queens-market.jpg";
import officeHQ from "@/assets/office-headquarters.jpg";
import neighborhoodsMap from "@/assets/neighborhoods-map.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import instagram1 from "@/assets/instagram-1.jpg";
import instagram2 from "@/assets/instagram-2.jpg";
import instagram3 from "@/assets/instagram-3.jpg";
import instagram4 from "@/assets/instagram-4.jpg";
import instagram5 from "@/assets/instagram-5.jpg";
import instagram6 from "@/assets/instagram-6.jpg";
import { COMPANY_INFO } from "@/lib/constants";

const CountUpNumber = ({ end, duration = 1000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <div ref={elementRef}>{count}+</div>;
};

const Home = () => {
  const featuredListings = mockListings.slice(0, 3);
  const { data: properties = [], isLoading, refetch } = useProperties();
  const representedBuildings = properties.filter(p => p.is_represented_building).slice(0, 6);
  
  const statsReveal = useScrollReveal();
  const portfolioReveal = useScrollReveal();
  const listingsReveal = useScrollReveal();

  const handleRefresh = async () => {
    await refetch();
  };

  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

  return (
    <div className="min-h-screen">
      <PullToRefreshIndicator
        isPulling={isPulling}
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />
      {/* Hero Section with Full Width Background */}
      <section 
        className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'grayscale(1)'
        }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <img 
            src={bridgeLogoWhite} 
            alt="BRIDGE Residential" 
            className="mb-4 md:mb-6 mx-auto h-24 md:h-32 lg:h-40 w-auto"
          />
          <p className="text-base md:text-2xl text-white/90 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto px-2">
            New York residential advisory for renters, buyers, landlords, and sellers
          </p>
          
          {/* CTA Buttons - Mobile Optimized */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 max-w-md mx-auto md:max-w-none">
            <Button 
              asChild 
              size="lg" 
              className="rounded-full w-full md:w-auto text-sm md:text-base shadow-xl hover:shadow-2xl"
            >
              <Link to="/renters-buyers">Looking to Rent</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="rounded-full w-full md:w-auto text-sm md:text-base shadow-xl hover:shadow-2xl"
            >
              <Link to="/renters-buyers">Looking to Buy</Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg" 
              className="rounded-full w-full md:w-auto text-sm md:text-base border-white/30 text-white hover:bg-white hover:text-background shadow-xl"
            >
              <Link to="/landlords-sellers">Landlord or Seller</Link>
            </Button>
          </div>

          {/* Search Bar - Mobile Optimized */}
          <div className="max-w-2xl mx-auto px-2">
            <div className="bg-card/95 backdrop-blur-md rounded-full p-2 flex items-center gap-2 shadow-2xl border border-border/50">
              <Input 
                placeholder="Search address or neighborhood" 
                className="border-0 bg-transparent focus-visible:ring-0 text-sm md:text-base placeholder:text-muted-foreground"
              />
              <Button size="icon" className="rounded-full flex-shrink-0 shadow-lg">
                <Search size={18} />
              </Button>
            </div>
            <Link to="/listings" className="text-xs md:text-sm text-white/80 hover:text-white mt-3 inline-block hover:underline transition-all">
              Advanced search →
            </Link>
          </div>
        </div>
      </section>

      {/* BRIDGE Residential Difference */}
      <section 
        ref={statsReveal.elementRef}
        className={`py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-card border-t border-border transition-all duration-1000 ${
          statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-center mb-4 md:mb-6 text-3xl md:text-5xl">BRIDGE Residential</h2>
          <p className="text-base md:text-lg text-center text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10 md:mb-12 px-2">
            {COMPANY_INFO.description.home}
          </p>

          {/* Stats - Mobile Optimized with Icons */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-gold/10 rounded-full border border-gold/20">
                <Building2 size={40} className="text-gold" />
              </div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">
                <CountUpNumber end={500} />
              </div>
              <p className="text-base md:text-lg text-muted-foreground font-medium">Units represented</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-gold/10 rounded-full border border-gold/20">
                <List size={40} className="text-gold" />
              </div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">
                <CountUpNumber end={100} />
              </div>
              <p className="text-base md:text-lg text-muted-foreground font-medium">Active listings</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-gold/10 rounded-full border border-gold/20">
                <Handshake size={40} className="text-gold" />
              </div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">
                <CountUpNumber end={50} />
              </div>
              <p className="text-base md:text-lg text-muted-foreground font-medium">Landlord relationships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Portfolio */}
      <section 
        ref={portfolioReveal.elementRef}
        className={`py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-border transition-all duration-1000 ${
          portfolioReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="mb-3 text-3xl md:text-5xl">Exclusive Portfolio</h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Buildings we manage across Manhattan, Brooklyn, and Queens
            </p>
          </div>
          {isLoading ? (
            <ListingCardSkeletonGrid count={6} />
          ) : representedBuildings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {representedBuildings.map((building) => (
                <Link key={building.id} to={`/listings/${building.id}`}>
                  <Card className="overflow-hidden border border-border bg-card hover-lift group h-full">
                    <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                      {building.images && building.images[0] && (
                        <img 
                          src={building.images[0]} 
                          alt={building.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-semibold mb-2">{building.title}</h3>
                      <div className="flex items-start gap-2 text-muted-foreground mb-2">
                        <MapPin size={16} className="mt-1 flex-shrink-0" />
                        <p className="text-xs md:text-sm">{building.address}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Building2 size={16} />
                        <span>{building.property_type || 'Building'}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm md:text-base">Our exclusive portfolio will be displayed here</p>
            </div>
          )}
        </div>
      </section>

      {/* Exclusive Listings */}
      <section 
        ref={listingsReveal.elementRef}
        className={`py-12 md:py-16 px-6 lg:px-8 border-t border-border transition-all duration-1000 ${
          listingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h2 className="mb-3">Exclusive Listings</h2>
              <p className="text-base md:text-lg text-muted-foreground">A selection of current homes and buildings represented by BRIDGE Residential.</p>
            </div>
            <Link to="/listings" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all whitespace-nowrap">
              View all listings
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-12 md:py-16 px-6 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-center mb-8 md:mb-10">Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Manhattan",
                description: "Focused coverage from uptown to downtown with a deep understanding of condo and rental product.",
                image: manhattanMarket
              },
              {
                title: "Brooklyn",
                description: "Targeted expertise across prime Brooklyn neighborhoods and design driven homes.",
                image: brooklynMarket
              },
              {
                title: "Queens",
                description: "Strategic presence in emerging Queens markets with strong value and growth potential.",
                image: queensMarket
              }
            ].map((market, index) => (
              <Card key={index} className="p-8 border border-border rounded-lg hover-lift bg-background">
                <div className="aspect-[4/3] rounded-lg mb-6 overflow-hidden">
                  <img 
                    src={market.image} 
                    alt={`${market.title} real estate`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{market.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{market.description}</p>
                <Link to="/listings" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all text-sm">
                  Explore {market.title}
                  <ArrowRight size={16} />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Headquarters */}
      <section className="py-12 md:py-16 px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={officeHQ} 
                alt="BRIDGE Residential Manhattan office headquarters"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="mb-6">BRIDGE Residential Headquarters in New York</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our Manhattan office serves as the operational center for all BRIDGE Residential activity. The workspace is designed to support both agent productivity and client engagement, with private meeting areas, shared resources, and full administrative support.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                As part of BRIDGE Advisory Group, BRIDGE Residential operates within a larger advisory ecosystem that includes commercial brokerage, investment sales, and capital advisory services.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all">
                Visit our office
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-12 md:py-16 px-6 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-center mb-8 md:mb-10">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Neighborhoods",
                description: "Detailed neighborhood profiles and market insights across all boroughs",
                link: "/listings",
                image: neighborhoodsMap
              },
              {
                title: "Team",
                description: "Meet the BRIDGE Residential team and learn about joining our platform",
                link: "/team",
                image: teamCollaboration
              }
            ].map((item, index) => (
              <Link key={index} to={item.link}>
                <Card className="p-8 border border-border rounded-lg hover-lift h-full bg-background">
                  <div className="aspect-square rounded-lg mb-6 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social / Instagram Grid */}
      <section className="py-12 md:py-16 px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="mb-3">Follow BRIDGE Residential</h2>
            <p className="text-lg text-muted-foreground mb-6">View current listings and stories on Instagram</p>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all"
            >
              Follow on Instagram
              <ArrowRight size={20} />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[instagram1, instagram2, instagram3, instagram4, instagram5, instagram6].map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden hover-lift">
                <img 
                  src={image} 
                  alt={`BRIDGE Residential property ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 md:py-16 px-6 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="mb-4">Connect with BRIDGE Residential</h2>
            <p className="text-lg text-muted-foreground">
              Share a few details about your search or property and a member of our team will respond quickly.
            </p>
          </div>
          <Card className="p-8 border border-border rounded-lg bg-background">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="(212) 555-0000" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us about your needs" rows={4} />
              </div>
              <Button size="lg" className="w-full rounded-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
