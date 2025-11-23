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
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Buildings from "./pages/Buildings";
import RentersBuyers from "./pages/RentersBuyers";
import LandlordsSellers from "./pages/LandlordsSellers";
import Team from "./pages/Team";
import Process from "./pages/Process";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Join from "./pages/Join";
import Auth from "./pages/Auth";
import Transactions from "./pages/Transactions";
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
          {/* Admin Routes - No Navigation/Footer */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="tours" element={<AdminTours />} />
          </Route>

          {/* Public Routes - With Navigation/Footer */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <PageTransition>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/listings" element={<Listings />} />
                      <Route path="/listings/:id" element={<ListingDetail />} />
                      <Route path="/buildings" element={<Buildings />} />
                      <Route path="/renters-buyers" element={<RentersBuyers />} />
                      <Route path="/landlords-sellers" element={<LandlordsSellers />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/process" element={<Process />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/join" element={<Join />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </PageTransition>
                <Footer />
                <FloatingChatButton />
                <FloatingContactButton onContactClick={() => setContactOpen(true)} />
                <FloatingLoginButton />
                <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
