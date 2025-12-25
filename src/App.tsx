import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { PortalLayout } from "@/components/portal/PortalLayout";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Portal Pages
import Dashboard from "./pages/portal/Dashboard";
import Templates from "./pages/portal/Templates";
import TemplateCategory from "./pages/portal/TemplateCategory";
import Tools from "./pages/portal/Tools";
import Directory from "./pages/portal/Directory";
import Calculators from "./pages/portal/Calculators";
import AI from "./pages/portal/AI";

// Admin Pages
import TeamAdmin from "./pages/admin/TeamAdmin";
import TransactionsAdmin from "./pages/admin/TransactionsAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import MarketsAdmin from "./pages/admin/MarketsAdmin";
import ListingLinksAdmin from "./pages/admin/ListingLinksAdmin";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Root redirects to portal */}
              <Route path="/" element={<Navigate to="/portal" replace />} />
              
              {/* Login */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth" element={<Navigate to="/login" replace />} />
              
              {/* Portal Routes (Protected) */}
              <Route path="/portal" element={<PortalLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="templates" element={<Templates />} />
                <Route path="templates/:division" element={<TemplateCategory />} />
                <Route path="directory" element={<Directory />} />
                <Route path="calculators" element={<Calculators />} />
                <Route path="tools" element={<Tools />} />
                <Route path="ai" element={<AI />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/team" replace />} />
                <Route path="team" element={<TeamAdmin />} />
                <Route path="transactions" element={<TransactionsAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="markets" element={<MarketsAdmin />} />
                <Route path="listing-links" element={<ListingLinksAdmin />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
