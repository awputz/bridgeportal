import { Link } from "react-router-dom";
import { Building2, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestmentOfferings } from "@/hooks/useInvestmentOfferings";
import { useTransactions } from "@/hooks/useTransactions";
import { useResearchNotes } from "@/hooks/useResearchNotes";
import logo from "@/assets/bridge-logo-white.png";
import heroImage from "@/assets/brooklyn-bridge-hero.jpg";

export default function Home() {
  const { data: offerings = [] } = useInvestmentOfferings();
  const { data: transactions = [] } = useTransactions();
  const { data: researchNotes = [] } = useResearchNotes();

  const activeOfferings = offerings.filter(o => o.offering_status === 'Active');
  const recentTransactions = transactions.slice(0, 3);
  const recentResearch = researchNotes.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-dark-bg/70" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <img src={logo} alt="BRIDGE" className="h-16 mx-auto mb-12 opacity-90" />
          <h1 className="text-foreground mb-6 font-light">
            NYC Investment Sales
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto font-light">
            Specialized commercial real estate advisory for multifamily, mixed-use, and development properties across New York City
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-light">
              <a href="https://crexi.com" target="_blank" rel="noopener noreferrer">
                View Listings
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-light">
              <Link to="/approach">Our Approach</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-dark-bg border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-foreground mb-2">50+</div>
              <div className="text-sm text-muted-foreground font-light">Buildings Sold</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-foreground mb-2">$500M+</div>
              <div className="text-sm text-muted-foreground font-light">Sales Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-foreground mb-2">1M+</div>
              <div className="text-sm text-muted-foreground font-light">Square Feet</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-foreground mb-2">98%</div>
              <div className="text-sm text-muted-foreground font-light">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-center mb-16 font-light">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <Building2 className="h-10 w-10 text-accent mb-4" />
                <CardTitle className="font-light">Building Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-light">
                  Complete transaction management for multifamily and mixed-use properties
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-accent mb-4" />
                <CardTitle className="font-light">Advisory</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-light">
                  Strategic guidance on market positioning and transaction structuring
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <Award className="h-10 w-10 text-accent mb-4" />
                <CardTitle className="font-light">Valuation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-light">
                  Comprehensive market analysis and property valuation services
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Offerings Preview */}
      {activeOfferings.length > 0 && (
        <section className="py-24 bg-dark-bg border-y border-border">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-light">Current Offerings</h2>
              <Button asChild variant="outline" className="font-light">
                <a href="https://crexi.com" target="_blank" rel="noopener noreferrer">
                  View All on Crexi
                </a>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {activeOfferings.slice(0, 3).map((offering) => (
                <Card key={offering.id} className="bg-card border-border hover:shadow-md transition-shadow">
                  {offering.images && offering.images[0] && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={offering.images[0]}
                        alt={offering.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-light text-xl">{offering.title}</CardTitle>
                    <CardDescription className="font-light">{offering.city}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-light">
                        {offering.property_type}
                      </span>
                      {!offering.price_on_request && (
                        <span className="font-light">
                          ${offering.price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Track Record Preview */}
      {recentTransactions.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-light">Recent Transactions</h2>
              <Button asChild variant="outline" className="font-light">
                <Link to="/track-record">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {recentTransactions.map((transaction) => (
                <Card key={transaction.id} className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-light text-lg">{transaction.property_address}</CardTitle>
                    <CardDescription className="font-light">{transaction.neighborhood}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-light">Type:</span>
                        <span className="font-light">{transaction.property_type}</span>
                      </div>
                      {transaction.sale_price && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-light">Price:</span>
                          <span className="font-light">${transaction.sale_price.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Preview */}
      {recentResearch.length > 0 && (
        <section className="py-24 bg-dark-bg border-y border-border">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-light">Market Research</h2>
              <Button asChild variant="outline" className="font-light">
                <Link to="/research">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {recentResearch.map((note) => (
                <Card key={note.id} className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="text-xs text-accent mb-2 font-light">{note.category}</div>
                    <CardTitle className="font-light text-lg">{note.title}</CardTitle>
                    <CardDescription className="font-light text-xs">
                      {new Date(note.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light line-clamp-3">
                      {note.summary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="mb-6 font-light">Ready to maximize your property value?</h2>
          <p className="text-lg text-muted-foreground mb-8 font-light">
            Connect with our team to discuss your investment goals
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
