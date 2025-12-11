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
import { ContactSheetProvider } from "@/contexts/ContactSheetContext";
// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import MarketInsights from "./pages/MarketInsights";
import Research from "./pages/Research";
import Contact from "./pages/Contact";
import TrackRecord from "./pages/TrackRecord";
import Auth from "./pages/Auth";
import TeamAdmin from "./pages/admin/TeamAdmin";
import TransactionsAdmin from "./pages/admin/TransactionsAdmin";
import PropertiesAdmin from "./pages/admin/PropertiesAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import MarketsAdmin from "./pages/admin/MarketsAdmin";
import ListingLinksAdmin from "./pages/admin/ListingLinksAdmin";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Careers from "./pages/Careers";
import Press from "./pages/Press";

// Service Pages
import ResidentialServices from "./pages/services/Residential";
import CommercialLeasing from "./pages/services/CommercialLeasing";
import InvestmentSales from "./pages/services/InvestmentSales";
import CapitalAdvisory from "./pages/services/CapitalAdvisory";
import PropertyManagement from "./pages/services/PropertyManagement";
import Marketing from "./pages/services/Marketing";
import Billboard from "./pages/services/Billboard";
import MarketsComingSoon from "./pages/MarketsComingSoon";

// Service Sub-Pages
import ResidentialFindAHome from "./pages/services/residential/FindAHome";
import ResidentialTransactions from "./pages/services/residential/Transactions";
import ResidentialLandlordServices from "./pages/services/residential/LandlordServices";
import ResidentialResources from "./pages/services/residential/Resources";
import ResidentialBuildings from "./pages/services/residential/Buildings";

import InvestmentAcquisitions from "./pages/services/investment-sales/Acquisitions";
import InvestmentDispositions from "./pages/services/investment-sales/Dispositions";
import InvestmentValuations from "./pages/services/investment-sales/Valuations";
import InvestmentTrackRecord from "./pages/services/investment-sales/TrackRecord";

import CommercialTenantRep from "./pages/services/commercial-leasing/TenantRep";
import CommercialLandlordRep from "./pages/services/commercial-leasing/LandlordRep";
import CommercialRetail from "./pages/services/commercial-leasing/Retail";
import CommercialOffice from "./pages/services/commercial-leasing/Office";

import CapitalDebt from "./pages/services/capital-advisory/Debt";
import CapitalEquity from "./pages/services/capital-advisory/Equity";
import CapitalRefinance from "./pages/services/capital-advisory/Refinance";
import CapitalConstruction from "./pages/services/capital-advisory/Construction";

import PMServices from "./pages/services/property-management/Services";
import PMPortfolio from "./pages/services/property-management/Portfolio";
import PMReporting from "./pages/services/property-management/Reporting";

import MarketingCreative from "./pages/services/marketing/Creative";
import MarketingDigital from "./pages/services/marketing/Digital";
import MarketingStrategy from "./pages/services/marketing/Strategy";

import BillboardInventory from "./pages/services/billboard/Inventory";
import BillboardPricing from "./pages/services/billboard/Pricing";
import BillboardCaseStudies from "./pages/services/billboard/CaseStudies";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContactSheetProvider>
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
              <Route path="properties" element={<PropertiesAdmin />} />
              <Route path="transactions" element={<TransactionsAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
              <Route path="services" element={<ServicesAdmin />} />
              <Route path="markets" element={<MarketsAdmin />} />
              <Route path="listing-links" element={<ListingLinksAdmin />} />
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
                    <Route path="/research" element={<Research />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/press" element={<Press />} />
                    
                    {/* Service Pages - Main */}
                    <Route path="/services/residential" element={<ResidentialServices />} />
                    <Route path="/services/commercial-leasing" element={<CommercialLeasing />} />
                    <Route path="/services/investment-sales" element={<InvestmentSales />} />
                    <Route path="/services/capital-advisory" element={<CapitalAdvisory />} />
                    <Route path="/services/property-management" element={<PropertyManagement />} />
                    <Route path="/services/marketing" element={<Marketing />} />
                    <Route path="/services/billboard" element={<Billboard />} />
                    
                    {/* Residential Sub-Pages */}
                    <Route path="/services/residential/find-a-home" element={<ResidentialFindAHome />} />
                    <Route path="/services/residential/transactions" element={<ResidentialTransactions />} />
                    <Route path="/services/residential/landlord-services" element={<ResidentialLandlordServices />} />
                    <Route path="/services/residential/buildings" element={<ResidentialBuildings />} />
                    <Route path="/services/residential/resources" element={<ResidentialResources />} />
                    {/* Legacy residential redirects */}
                    <Route path="/services/residential/rentals" element={<Navigate to="/services/residential/find-a-home" replace />} />
                    <Route path="/services/residential/sales" element={<Navigate to="/services/residential/find-a-home" replace />} />
                    <Route path="/services/residential/listings" element={<Navigate to="/services/residential/find-a-home" replace />} />
                    <Route path="/services/residential/markets" element={<Navigate to="/services/residential" replace />} />
                    
                    {/* Investment Sales Sub-Pages */}
                    <Route path="/services/investment-sales/acquisitions" element={<InvestmentAcquisitions />} />
                    <Route path="/services/investment-sales/dispositions" element={<InvestmentDispositions />} />
                    <Route path="/services/investment-sales/valuations" element={<InvestmentValuations />} />
                    <Route path="/services/investment-sales/track-record" element={<InvestmentTrackRecord />} />
                    
                    {/* Commercial Leasing Sub-Pages */}
                    <Route path="/services/commercial-leasing/tenant-rep" element={<CommercialTenantRep />} />
                    <Route path="/services/commercial-leasing/landlord-rep" element={<CommercialLandlordRep />} />
                    <Route path="/services/commercial-leasing/retail" element={<CommercialRetail />} />
                    <Route path="/services/commercial-leasing/office" element={<CommercialOffice />} />
                    
                    {/* Capital Advisory Sub-Pages */}
                    <Route path="/services/capital-advisory/debt" element={<CapitalDebt />} />
                    <Route path="/services/capital-advisory/equity" element={<CapitalEquity />} />
                    <Route path="/services/capital-advisory/refinance" element={<CapitalRefinance />} />
                    <Route path="/services/capital-advisory/construction" element={<CapitalConstruction />} />
                    
                    {/* Property Management Sub-Pages */}
                    <Route path="/services/property-management/services" element={<PMServices />} />
                    <Route path="/services/property-management/portfolio" element={<PMPortfolio />} />
                    <Route path="/services/property-management/reporting" element={<PMReporting />} />
                    
                    {/* Marketing Sub-Pages */}
                    <Route path="/services/marketing/creative" element={<MarketingCreative />} />
                    <Route path="/services/marketing/digital" element={<MarketingDigital />} />
                    <Route path="/services/marketing/strategy" element={<MarketingStrategy />} />
                    
                    {/* Billboard Sub-Pages */}
                    <Route path="/services/billboard/inventory" element={<BillboardInventory />} />
                    <Route path="/services/billboard/pricing" element={<BillboardPricing />} />
                    <Route path="/services/billboard/case-studies" element={<BillboardCaseStudies />} />
                    
                    {/* Track Record */}
                    <Route path="/track-record" element={<TrackRecord />} />
                    
                    {/* Markets Coming Soon */}
                    <Route path="/markets-coming-soon" element={<MarketsComingSoon />} />
                    
                    {/* Legacy routes - redirect to new structure */}
                    <Route path="/commercial" element={<Navigate to="/services/investment-sales" replace />} />
                    <Route path="/commercial/*" element={<Navigate to="/services/investment-sales" replace />} />
                    <Route path="/residential" element={<Navigate to="/services/residential" replace />} />
                    <Route path="/residential/*" element={<Navigate to="/services/residential" replace />} />
                    <Route path="/capital-markets" element={<Navigate to="/services/capital-advisory" replace />} />
                    <Route path="/approach" element={<Navigate to="/about" replace />} />
                    <Route path="/services" element={<Navigate to="/" replace />} />
                    <Route path="/markets" element={<Navigate to="/markets-coming-soon" replace />} />
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
        </ContactSheetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;