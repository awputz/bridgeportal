import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import FloatingChatButton from "@/components/FloatingChatButton";
import { PageTransition } from "@/components/PageTransition";
import { FloatingContactButton } from "@/components/FloatingContactButton";
import { ContactSheet } from "@/components/ContactSheet";
import { FloatingLoginButton } from "@/components/FloatingLoginButton";
import { AdminLayout } from "./components/admin/AdminLayout";
import Home from "./pages/Home";
import Offerings from "./pages/Offerings";
import ListingDetail from "./pages/ListingDetail";
import TrackRecord from "./pages/TrackRecord";
import Approach from "./pages/Approach";
import Research from "./pages/Research";
import SubmitDeal from "./pages/SubmitDeal";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminInquiries } from "./pages/admin/Inquiries";
import { AdminProperties } from "./pages/admin/Properties";
import { AdminTours } from "./pages/admin/Tours";

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
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="tours" element={<AdminTours />} />
          </Route>

          {/* Public Routes */}
          <Route path="*" element={
            <>
              <Navigation />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/offerings" element={<Offerings />} />
                  <Route path="/offerings/:id" element={<ListingDetail />} />
                  <Route path="/track-record" element={<TrackRecord />} />
                  <Route path="/approach" element={<Approach />} />
                  <Route path="/research" element={<Research />} />
                  <Route path="/submit-deal" element={<SubmitDeal />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
              <Footer />
              <FloatingChatButton />
              <FloatingContactButton onClick={() => setContactOpen(true)} />
              <FloatingLoginButton />
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