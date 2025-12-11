import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageTransition } from "@/components/PageTransition";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import MarketInsights from "./pages/MarketInsights";
import Contact from "./pages/Contact";
import TrackRecord from "./pages/TrackRecord";
import Auth from "./pages/Auth";
import TeamAdmin from "./pages/admin/TeamAdmin";
import TransactionsAdmin from "./pages/admin/TransactionsAdmin";
import NotFound from "./pages/NotFound";

// Service Pages
import ResidentialServices from "./pages/services/Residential";
import CommercialLeasing from "./pages/services/CommercialLeasing";
import InvestmentSales from "./pages/services/InvestmentSales";
import CapitalAdvisory from "./pages/services/CapitalAdvisory";
import Marketing from "./pages/services/Marketing";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/team" replace />} />
              <Route path="team" element={<TeamAdmin />} />
              <Route path="transactions" element={<TransactionsAdmin />} />
            </Route>

            {/* Public Routes */}
            <Route path="*" element={
              <>
                <Navigation />
                <PageTransition>
                  <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />
                    
                    {/* Main Pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/insights" element={<MarketInsights />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Service Pages */}
                    <Route path="/services/residential" element={<ResidentialServices />} />
                    <Route path="/services/commercial-leasing" element={<CommercialLeasing />} />
                    <Route path="/services/investment-sales" element={<InvestmentSales />} />
                    <Route path="/services/capital-advisory" element={<CapitalAdvisory />} />
                    <Route path="/services/marketing" element={<Marketing />} />
                    
                    {/* Track Record */}
                    <Route path="/track-record" element={<TrackRecord />} />
                    
                    {/* Legacy routes - redirect to new structure */}
                    <Route path="/commercial" element={<Navigate to="/services/investment-sales" replace />} />
                    <Route path="/commercial/*" element={<Navigate to="/services/investment-sales" replace />} />
                    <Route path="/residential" element={<Navigate to="/services/residential" replace />} />
                    <Route path="/residential/*" element={<Navigate to="/services/residential" replace />} />
                    <Route path="/capital-markets" element={<Navigate to="/services/capital-advisory" replace />} />
                    <Route path="/approach" element={<Navigate to="/about" replace />} />
                    <Route path="/services" element={<Navigate to="/" replace />} />
                    <Route path="/markets" element={<Navigate to="/" replace />} />
                    <Route path="/market-insights" element={<Navigate to="/insights" replace />} />
                    <Route path="/submit-deal" element={<Navigate to="/contact" replace />} />
                    <Route path="/transactions" element={<Navigate to="/track-record" replace />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
                <Footer />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
