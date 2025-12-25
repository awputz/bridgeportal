import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { DivisionProvider } from "@/contexts/DivisionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Pages - eager loaded for fast initial load
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/portal/Dashboard";

// Portal Pages - lazy loaded for better performance
const Templates = lazy(() => import("./pages/portal/Templates"));
const TemplateCategory = lazy(() => import("./pages/portal/TemplateCategory"));
const Tools = lazy(() => import("./pages/portal/Tools"));
const Directory = lazy(() => import("./pages/portal/Directory"));
const Calculators = lazy(() => import("./pages/portal/Calculators"));
const AI = lazy(() => import("./pages/portal/AI"));
const CRM = lazy(() => import("./pages/portal/CRM"));
const DealDetail = lazy(() => import("./pages/portal/DealDetail"));
const ContactDetail = lazy(() => import("./pages/portal/ContactDetail"));
const NewDeal = lazy(() => import("./pages/portal/NewDeal"));
const Generators = lazy(() => import("./pages/portal/Generators"));
const Profile = lazy(() => import("./pages/portal/Profile"));

// Admin Pages - lazy loaded
const TeamAdmin = lazy(() => import("./pages/admin/TeamAdmin"));
const TransactionsAdmin = lazy(() => import("./pages/admin/TransactionsAdmin"));
const SettingsAdmin = lazy(() => import("./pages/admin/SettingsAdmin"));
const ServicesAdmin = lazy(() => import("./pages/admin/ServicesAdmin"));
const MarketsAdmin = lazy(() => import("./pages/admin/MarketsAdmin"));
const ListingLinksAdmin = lazy(() => import("./pages/admin/ListingLinksAdmin"));
const ToolsAdmin = lazy(() => import("./pages/admin/ToolsAdmin"));
const TemplatesAdmin = lazy(() => import("./pages/admin/TemplatesAdmin"));

// Optimized QueryClient with better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DivisionProvider>
            <ErrorBoundary>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                  {/* Root redirects to portal */}
                  <Route path="/" element={<Navigate to="/portal" replace />} />
                  
                  {/* Login */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  
                  {/* Portal Routes (Protected) */}
                  <Route path="/portal" element={<PortalLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="templates" element={
                      <Suspense fallback={<PageLoader />}>
                        <Templates />
                      </Suspense>
                    } />
                    <Route path="templates/:division" element={
                      <Suspense fallback={<PageLoader />}>
                        <TemplateCategory />
                      </Suspense>
                    } />
                    <Route path="directory" element={
                      <Suspense fallback={<PageLoader />}>
                        <Directory />
                      </Suspense>
                    } />
                    <Route path="calculators" element={
                      <Suspense fallback={<PageLoader />}>
                        <Calculators />
                      </Suspense>
                    } />
                    <Route path="tools" element={
                      <Suspense fallback={<PageLoader />}>
                        <Tools />
                      </Suspense>
                    } />
                    <Route path="ai" element={
                      <Suspense fallback={<PageLoader />}>
                        <AI />
                      </Suspense>
                    } />
                    <Route path="crm" element={
                      <Suspense fallback={<PageLoader />}>
                        <CRM />
                      </Suspense>
                    } />
                    <Route path="crm/deals/new" element={
                      <Suspense fallback={<PageLoader />}>
                        <NewDeal />
                      </Suspense>
                    } />
                    <Route path="crm/deals/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <DealDetail />
                      </Suspense>
                    } />
                    <Route path="crm/contacts/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <ContactDetail />
                      </Suspense>
                    } />
                    <Route path="generators" element={
                      <Suspense fallback={<PageLoader />}>
                        <Generators />
                      </Suspense>
                    } />
                    <Route path="profile" element={
                      <Suspense fallback={<PageLoader />}>
                        <Profile />
                      </Suspense>
                    } />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/team" replace />} />
                    <Route path="team" element={
                      <Suspense fallback={<PageLoader />}>
                        <TeamAdmin />
                      </Suspense>
                    } />
                    <Route path="transactions" element={
                      <Suspense fallback={<PageLoader />}>
                        <TransactionsAdmin />
                      </Suspense>
                    } />
                    <Route path="settings" element={
                      <Suspense fallback={<PageLoader />}>
                        <SettingsAdmin />
                      </Suspense>
                    } />
                    <Route path="services" element={
                      <Suspense fallback={<PageLoader />}>
                        <ServicesAdmin />
                      </Suspense>
                    } />
                    <Route path="markets" element={
                      <Suspense fallback={<PageLoader />}>
                        <MarketsAdmin />
                      </Suspense>
                    } />
                    <Route path="listing-links" element={
                      <Suspense fallback={<PageLoader />}>
                        <ListingLinksAdmin />
                      </Suspense>
                    } />
                    <Route path="tools" element={
                      <Suspense fallback={<PageLoader />}>
                        <ToolsAdmin />
                      </Suspense>
                    } />
                    <Route path="templates" element={
                      <Suspense fallback={<PageLoader />}>
                        <TemplatesAdmin />
                      </Suspense>
                    } />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </DivisionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
