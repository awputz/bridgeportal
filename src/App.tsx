import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageTransition } from "@/components/PageTransition";
import { FloatingContactButton } from "@/components/FloatingContactButton";
import { ContactSheet } from "@/components/ContactSheet";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import Commercial from "./pages/Commercial";
import Residential from "./pages/Residential";
import TrackRecord from "./pages/TrackRecord";
import Approach from "./pages/Approach";
import Services from "./pages/Services";
import Markets from "./pages/Markets";
import SubmitDeal from "./pages/SubmitDeal";
import Team from "./pages/Team";
import MarketInsights from "./pages/MarketInsights";
import Auth from "./pages/Auth";
import TeamAdmin from "./pages/admin/TeamAdmin";
import TransactionsAdmin from "./pages/admin/TransactionsAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [contactOpen, setContactOpen] = useState(false);

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
                    
                    {/* Commercial & Investment Hub */}
                    <Route path="/commercial" element={<Commercial />} />
                    <Route path="/commercial/office" element={<Commercial />} />
                    <Route path="/commercial/retail" element={<Commercial />} />
                    <Route path="/commercial/industrial" element={<Commercial />} />
                    <Route path="/commercial/investment-sales" element={<Commercial />} />
                    <Route path="/commercial/track-record" element={<TrackRecord />} />
                    
                    {/* Residential Hub */}
                    <Route path="/residential" element={<Residential />} />
                    <Route path="/residential/listings" element={<Residential />} />
                    <Route path="/residential/sell" element={<Residential />} />
                    <Route path="/residential/track-record" element={<TrackRecord />} />
                    
                    {/* Shared Pages */}
                    <Route path="/capital-markets" element={<Services />} />
                    <Route path="/about" element={<Approach />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/market-insights" element={<MarketInsights />} />
                    <Route path="/submit-deal" element={<SubmitDeal />} />
                    
                    {/* Legacy routes - redirect to new structure */}
                    <Route path="/transactions" element={<Navigate to="/commercial/track-record" replace />} />
                    <Route path="/approach" element={<Navigate to="/about" replace />} />
                    <Route path="/services" element={<Navigate to="/capital-markets" replace />} />
                    <Route path="/markets" element={<Navigate to="/commercial" replace />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
                <Footer />
                <FloatingContactButton onContactClick={() => setContactOpen(true)} />
                <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
