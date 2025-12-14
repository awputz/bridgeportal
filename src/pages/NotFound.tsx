import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Briefcase, Phone, Building2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import brooklynBridge from "@/assets/brooklyn-bridge-hero.jpg";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Bridge Advisory Group</title>
        <meta name="description" content="The page you're looking for doesn't exist. Navigate back to Bridge Advisory Group's NYC real estate services." />
      </Helmet>
      
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${brooklynBridge})` }}
        >
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl">
          {/* Logo */}
          <img 
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
            alt="Bridge Advisory Group" 
            className="h-10 md:h-12 mx-auto mb-8 opacity-80"
          />
          
          <h1 className="text-7xl md:text-9xl font-bold mb-4 text-foreground/20">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
            The page you're looking for doesn't exist or may have been moved.
            Let us help you find your way.
          </p>
          
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/">
                <Home className="mr-2" size={18} />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/contact">
                <Phone className="mr-2" size={18} />
                Contact Us
              </Link>
            </Button>
          </div>
          
          {/* Quick Links */}
          <div className="border-t border-border/30 pt-8">
            <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link to="/services/investment-sales">
                  <Building2 className="mr-1.5" size={14} />
                  Investment Sales
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link to="/services/commercial-leasing">
                  <Briefcase className="mr-1.5" size={14} />
                  Commercial Leasing
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link to="/team">
                  <Users className="mr-1.5" size={14} />
                  Our Team
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Tagline */}
          <p className="mt-12 text-xs text-muted-foreground/60 uppercase tracking-widest">
            Building Bridges to Better Real Estate
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
