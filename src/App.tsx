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
const Notes = lazy(() => import("./pages/portal/Notes"));
const Directory = lazy(() => import("./pages/portal/Directory"));
const Calculators = lazy(() => import("./pages/portal/Calculators"));
const AI = lazy(() => import("./pages/portal/AI"));
const CRM = lazy(() => import("./pages/portal/CRM"));
const Contacts = lazy(() => import("./pages/portal/Contacts"));
const DealDetail = lazy(() => import("./pages/portal/DealDetail"));
const ContactDetail = lazy(() => import("./pages/portal/ContactDetail"));
const NewDeal = lazy(() => import("./pages/portal/NewDeal"));
const Generators = lazy(() => import("./pages/portal/Generators"));
const Profile = lazy(() => import("./pages/portal/Profile"));
const Tasks = lazy(() => import("./pages/portal/Tasks"));
const Mail = lazy(() => import("./pages/portal/Mail"));
// Analytics page removed - functionality consolidated into dashboard
const Resources = lazy(() => import("./pages/portal/Resources"));
const Requests = lazy(() => import("./pages/portal/Requests"));
const MyTransactions = lazy(() => import("./pages/portal/MyTransactions"));
const CommissionRequest = lazy(() => import("./pages/portal/CommissionRequest"));
const MyCommissionRequests = lazy(() => import("./pages/portal/MyCommissionRequests"));
const Tools = lazy(() => import("./pages/portal/Tools"));

// Company Pages - lazy loaded
const AboutCompany = lazy(() => import("./pages/portal/company/About"));
const MissionCompany = lazy(() => import("./pages/portal/company/Mission"));
const CultureCompany = lazy(() => import("./pages/portal/company/Culture"));
const ExpectationsCompany = lazy(() => import("./pages/portal/company/Expectations"));
const ExpansionCompany = lazy(() => import("./pages/portal/company/Expansion"));
const ContactCompany = lazy(() => import("./pages/portal/company/Contact"));
const Announcements = lazy(() => import("./pages/portal/Announcements"));
const CompanyHub = lazy(() => import("./pages/portal/Company"));

// Admin Pages - lazy loaded
const TeamAdmin = lazy(() => import("./pages/admin/TeamAdmin"));
const TransactionsAdmin = lazy(() => import("./pages/admin/TransactionsAdmin"));
const SettingsAdmin = lazy(() => import("./pages/admin/SettingsAdmin"));
const ServicesAdmin = lazy(() => import("./pages/admin/ServicesAdmin"));
const MarketsAdmin = lazy(() => import("./pages/admin/MarketsAdmin"));
const ListingLinksAdmin = lazy(() => import("./pages/admin/ListingLinksAdmin"));
const ToolsAdmin = lazy(() => import("./pages/admin/ToolsAdmin"));
const TemplatesAdmin = lazy(() => import("./pages/admin/TemplatesAdmin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ListingsAdmin = lazy(() => import("./pages/admin/ListingsAdmin"));
const AnnouncementsAdmin = lazy(() => import("./pages/admin/AnnouncementsAdmin"));
const InquiriesAdmin = lazy(() => import("./pages/admin/InquiriesAdmin"));
const ResourcesAdmin = lazy(() => import("./pages/admin/ResourcesAdmin"));
const UsersAdmin = lazy(() => import("./pages/admin/UsersAdmin"));
const DealRoomAdmin = lazy(() => import("./pages/admin/DealRoomAdmin"));
const BuildingsAdmin = lazy(() => import("./pages/admin/BuildingsAdmin"));
const AgentRequestsAdmin = lazy(() => import("./pages/admin/AgentRequestsAdmin"));
const NewsletterAdmin = lazy(() => import("./pages/admin/NewsletterAdmin"));
const ActivityLogsAdmin = lazy(() => import("./pages/admin/ActivityLogsAdmin"));
const CRMConfigAdmin = lazy(() => import("./pages/admin/CRMConfigAdmin"));
const MyExclusives = lazy(() => import("./pages/portal/MyExclusives"));
const CommissionRequestsAdmin = lazy(() => import("./pages/admin/CommissionRequestsAdmin"));
const CRMOverviewAdmin = lazy(() => import("./pages/admin/CRMOverviewAdmin"));
const AgentPerformanceAdmin = lazy(() => import("./pages/admin/AgentPerformanceAdmin"));

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
                    <Route path="contacts" element={
                      <Suspense fallback={<PageLoader />}>
                        <Contacts />
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
                    <Route path="tasks" element={
                      <Suspense fallback={<PageLoader />}>
                        <Tasks />
                      </Suspense>
                    } />
                    <Route path="mail" element={
                      <Suspense fallback={<PageLoader />}>
                        <Mail />
                      </Suspense>
                    } />
                    {/* Analytics route removed */}
                    <Route path="resources" element={
                      <Suspense fallback={<PageLoader />}>
                        <Resources />
                      </Suspense>
                    } />
                    <Route path="requests" element={
                      <Suspense fallback={<PageLoader />}>
                        <Requests />
                      </Suspense>
                    } />
                    <Route path="my-transactions" element={
                      <Suspense fallback={<PageLoader />}>
                        <MyTransactions />
                      </Suspense>
                    } />
                    <Route path="notes" element={
                      <Suspense fallback={<PageLoader />}>
                        <Notes />
                      </Suspense>
                    } />
                    <Route path="my-exclusives" element={
                      <Suspense fallback={<PageLoader />}>
                        <MyExclusives />
                      </Suspense>
                    } />
                    <Route path="commission-request" element={
                      <Suspense fallback={<PageLoader />}>
                        <CommissionRequest />
                      </Suspense>
                    } />
                    <Route path="my-commission-requests" element={
                      <Suspense fallback={<PageLoader />}>
                        <MyCommissionRequests />
                      </Suspense>
                    } />
                    
                    {/* Company Pages */}
                    <Route path="company/about" element={
                      <Suspense fallback={<PageLoader />}>
                        <AboutCompany />
                      </Suspense>
                    } />
                    <Route path="company/mission" element={
                      <Suspense fallback={<PageLoader />}>
                        <MissionCompany />
                      </Suspense>
                    } />
                    <Route path="company/culture" element={
                      <Suspense fallback={<PageLoader />}>
                        <CultureCompany />
                      </Suspense>
                    } />
                    <Route path="company/expectations" element={
                      <Suspense fallback={<PageLoader />}>
                        <ExpectationsCompany />
                      </Suspense>
                    } />
                    <Route path="company/expansion" element={
                      <Suspense fallback={<PageLoader />}>
                        <ExpansionCompany />
                      </Suspense>
                    } />
                    <Route path="company/contact" element={
                      <Suspense fallback={<PageLoader />}>
                        <ContactCompany />
                      </Suspense>
                    } />
                    <Route path="announcements" element={
                      <Suspense fallback={<PageLoader />}>
                        <Announcements />
                      </Suspense>
                    } />
                    <Route path="company" element={
                      <Suspense fallback={<PageLoader />}>
                        <CompanyHub />
                      </Suspense>
                    } />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminDashboard />
                      </Suspense>
                    } />
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
                    <Route path="listings" element={
                      <Suspense fallback={<PageLoader />}>
                        <ListingsAdmin />
                      </Suspense>
                    } />
                    <Route path="announcements" element={
                      <Suspense fallback={<PageLoader />}>
                        <AnnouncementsAdmin />
                      </Suspense>
                    } />
                    <Route path="inquiries" element={
                      <Suspense fallback={<PageLoader />}>
                        <InquiriesAdmin />
                      </Suspense>
                    } />
                    <Route path="resources" element={
                      <Suspense fallback={<PageLoader />}>
                        <ResourcesAdmin />
                      </Suspense>
                    } />
                    <Route path="users" element={
                      <Suspense fallback={<PageLoader />}>
                        <UsersAdmin />
                      </Suspense>
                    } />
                    <Route path="deal-room" element={
                      <Suspense fallback={<PageLoader />}>
                        <DealRoomAdmin />
                      </Suspense>
                    } />
                    <Route path="buildings" element={
                      <Suspense fallback={<PageLoader />}>
                        <BuildingsAdmin />
                      </Suspense>
                    } />
                    <Route path="agent-requests" element={
                      <Suspense fallback={<PageLoader />}>
                        <AgentRequestsAdmin />
                      </Suspense>
                    } />
                    <Route path="newsletter" element={
                      <Suspense fallback={<PageLoader />}>
                        <NewsletterAdmin />
                      </Suspense>
                    } />
                    <Route path="activity-logs" element={
                      <Suspense fallback={<PageLoader />}>
                        <ActivityLogsAdmin />
                      </Suspense>
                    } />
                    <Route path="crm-config" element={
                      <Suspense fallback={<PageLoader />}>
                        <CRMConfigAdmin />
                      </Suspense>
                    } />
                    <Route path="crm-overview" element={
                      <Suspense fallback={<PageLoader />}>
                        <CRMOverviewAdmin />
                      </Suspense>
                    } />
                    <Route path="agent-performance" element={
                      <Suspense fallback={<PageLoader />}>
                        <AgentPerformanceAdmin />
                      </Suspense>
                    } />
                    <Route path="commission-requests" element={
                      <Suspense fallback={<PageLoader />}>
                        <CommissionRequestsAdmin />
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
