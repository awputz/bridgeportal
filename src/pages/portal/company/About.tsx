import { Link } from "react-router-dom";
import { Building2, TrendingUp, Home, DollarSign, Palette, Users, MapPin, Calendar, Award, Target } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const divisions = [
  {
    name: "Investment Sales",
    description: "Acquisition and disposition advisory, portfolio strategy",
    icon: TrendingUp,
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    name: "Commercial Leasing",
    description: "Tenant and landlord representation for office and retail",
    icon: Building2,
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "Residential",
    description: "Landlord leasing programs, renter services, sales",
    icon: Home,
    color: "bg-emerald-500/20 text-emerald-400"
  },
  {
    name: "Capital Advisory",
    description: "Debt and equity financing solutions",
    icon: DollarSign,
    color: "bg-amber-500/20 text-amber-400"
  },
  {
    name: "Marketing",
    description: "In-house creative and marketing support",
    icon: Palette,
    color: "bg-rose-500/20 text-rose-400"
  }
];

const stats = [
  { value: 100, suffix: "M+", label: "Transactions Closed", prefix: "$" },
  { value: 15, suffix: "+", label: "Years Combined Experience" },
  { value: 350, suffix: "+", label: "Listings Managed" },
  { value: 2024, suffix: "", label: "Est." }
];

const About = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back to Company */}
        <Link 
          to="/portal/company" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          ← Back to Company
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">About Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            Bridge Advisory Group
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Founded in 2024, we are a multi-division real estate platform that unifies residential, commercial leasing, 
            investment sales, capital advisory, and marketing services under one integrated umbrella.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-5 text-center min-h-[88px] flex flex-col justify-center">
              <div className="text-2xl md:text-3xl font-light text-foreground mb-1">
                {stat.prefix && <span>{stat.prefix}</span>}
                <AnimatedCounter end={stat.value} duration={2000} />
                <span>{stat.suffix}</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground font-light">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Headquarters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-light text-foreground mb-1">Headquarters</h3>
              <p className="text-muted-foreground font-light">
                600 Third Avenue, Floors 2 and 10<br />
                New York, NY 10016
              </p>
            </div>
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-light text-foreground mb-2">What Sets Bridge Apart</h3>
              <p className="text-muted-foreground font-light">
                The integration of all our services into a unified platform with principal-level thinking and hands-on execution. 
                Our cross-divisional approach ensures clients receive comprehensive solutions that maximize value across every transaction.
              </p>
            </div>
          </div>
        </div>

        {/* Our Divisions */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            Our Divisions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisions.map((division, index) => {
              const Icon = division.icon;
              return (
                <div key={index} className="glass-card p-5 hover:border-white/20 transition-all duration-300 min-h-[120px]">
                  <div className={`w-10 h-10 rounded-full ${division.color.split(' ')[0]} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${division.color.split(' ')[1]}`} />
                  </div>
                  <h4 className="text-foreground font-light mb-2">{division.name}</h4>
                  <p className="text-sm text-muted-foreground font-light">{division.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founded Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Established 2024 · New York City</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
