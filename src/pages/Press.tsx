import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ExternalLink, Calendar, FileText, Download } from "lucide-react";

const pressReleases = [
  {
    title: "Bridge Advisory Group Closes $45M Multifamily Portfolio in Brooklyn",
    date: "November 2024",
    excerpt: "Bridge Investment Sales advised on the sale of a 150-unit portfolio across three Brooklyn neighborhoods, marking one of the largest multifamily transactions of Q4 2024.",
    link: "#"
  },
  {
    title: "Bridge Residential Expands Portfolio Management to 500+ Units",
    date: "October 2024",
    excerpt: "The residential division reaches a milestone with the addition of new landlord partnerships across Manhattan and Queens.",
    link: "#"
  },
  {
    title: "Bridge Commercial Completes 50,000 SF Retail Leasing in Downtown Brooklyn",
    date: "September 2024",
    excerpt: "A major retail tenant signed for a flagship location in Downtown Brooklyn, with Bridge Commercial representing the landlord.",
    link: "#"
  },
  {
    title: "Bridge Advisory Group Named Top Boutique Brokerage by Real Estate Weekly",
    date: "August 2024",
    excerpt: "Recognition for outstanding performance in investment sales and client service in the NYC market.",
    link: "#"
  },
];

const mediaFeatures = [
  { publication: "The Real Deal", title: "NYC's Rising Boutique Brokerages", date: "Oct 2024" },
  { publication: "Commercial Observer", title: "Brooklyn Multifamily Market Analysis", date: "Sep 2024" },
  { publication: "Real Estate Weekly", title: "Top 40 Under 40", date: "Aug 2024" },
  { publication: "Bisnow", title: "Capital Markets Outlook 2024", date: "Jul 2024" },
];

const mediaKitItems = [
  { title: "Company Overview", description: "One-page overview of Bridge Advisory Group and services", format: "PDF" },
  { title: "Leadership Bios", description: "Biographies and headshots of senior leadership", format: "PDF" },
  { title: "Logo Assets", description: "High-resolution logos in various formats", format: "ZIP" },
  { title: "Fact Sheet", description: "Key statistics and company milestones", format: "PDF" },
];

export default function Press() {
  const heroReveal = useScrollReveal(0.1);
  const releasesReveal = useScrollReveal(0.1);
  const mediaReveal = useScrollReveal(0.1);
  const kitReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5" ref={heroReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-light mb-6 transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Press & Media
          </h1>
          <p className={`text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ animationDelay: '100ms' }}>
            News, press releases, and media resources from Bridge Advisory Group
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={releasesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${
            releasesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">Press Releases</h2>
            <div className="space-y-8">
              {pressReleases.map((release, index) => (
                <article 
                  key={release.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-light mb-3">
                    <Calendar className="h-4 w-4" />
                    {release.date}
                  </div>
                  <h3 className="text-xl font-light mb-3">{release.title}</h3>
                  <p className="text-muted-foreground font-light mb-4">{release.excerpt}</p>
                  <a 
                    href={release.link} 
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-light text-sm transition-colors"
                  >
                    Read More <ExternalLink className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Features */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={mediaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${
            mediaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">In The News</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {mediaFeatures.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02]"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <p className="text-accent font-light text-sm mb-2">{feature.publication}</p>
                  <h3 className="text-lg font-light mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{feature.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={kitReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${
            kitReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Media Kit</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Download resources for press and media coverage.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {mediaKitItems.map((item, index) => (
                <div 
                  key={item.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] flex items-start gap-4"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <FileText className="h-8 w-8 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-light mb-1">{item.title}</h3>
                    <p className="text-muted-foreground font-light text-sm mb-3">{item.description}</p>
                    <button className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-light text-sm transition-colors">
                      <Download className="h-4 w-4" />
                      Download {item.format}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-20 md:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Media Inquiries</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            For press inquiries, interview requests, or additional information, please contact our communications team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-light">
              <a href="mailto:press@bridgeadvisorygroup.com">
                Contact Press Team
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-light">
              <Link to="/contact">General Inquiries</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}