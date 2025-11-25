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
import Home from "./pages/Home";
import TrackRecord from "./pages/TrackRecord";
import Approach from "./pages/Approach";
import Services from "./pages/Services";
import Markets from "./pages/Markets";
import SubmitDeal from "./pages/SubmitDeal";
import Team from "./pages/Team";
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
                  <Route path="/" element={<Home />} />
                  <Route path="/transactions" element={<TrackRecord />} />
                  <Route path="/approach" element={<Approach />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/submit-deal" element={<SubmitDeal />} />
                  <Route path="/team" element={<Team />} />
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
