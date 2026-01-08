import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { InvestorLayout } from "@/components/investor/InvestorLayout";
import { HRLayout } from "@/components/hr/HRLayout";
import { DivisionProvider } from "@/contexts/DivisionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContactSheetProvider } from "@/contexts/ContactSheetContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipLink } from "@/components/SkipLink";

// Pages - eager loaded for fast initial load
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/portal/Dashboard";

// Investor pages - lazy loaded
const InvestorLogin = lazy(() => import("./pages/InvestorLogin"));
const InvestorDashboard = lazy(() => import("./pages/investor/Dashboard"));
const InvestorPerformance = lazy(() => import("./pages/investor/Performance"));
const InvestorTransactions = lazy(() => import("./pages/investor/Transactions"));
const InvestorTeam = lazy(() => import("./pages/investor/Team"));
const InvestorCommissions = lazy(() => import("./pages/investor/Commissions"));
const InvestorReports = lazy(() => import("./pages/investor/Reports"));
const InvestorAgentRequests = lazy(() => import("./pages/investor/AgentRequests"));
const InvestorCommissionRequests = lazy(() => import("./pages/investor/CommissionRequests"));
const InvestorListings = lazy(() => import("./pages/investor/Listings"));

// HR pages - lazy loaded
const HRSignIn = lazy(() => import("./pages/hr/HRSignIn"));
const HRDashboard = lazy(() => import("./pages/hr/HRDashboard"));
const AgentDatabase = lazy(() => import("./pages/hr/AgentDatabase"));
const AgentProfile = lazy(() => import("./pages/hr/AgentProfile"));
const RecruitmentPipeline = lazy(() => import("./pages/hr/RecruitmentPipeline"));
const OutreachCampaigns = lazy(() => import("./pages/hr/OutreachCampaigns"));
const CampaignDetail = lazy(() => import("./pages/hr/CampaignDetail"));
const Interviews = lazy(() => import("./pages/hr/Interviews"));
const InterviewDetail = lazy(() => import("./pages/hr/InterviewDetail"));
const Offers = lazy(() => import("./pages/hr/Offers"));
const OfferDetail = lazy(() => import("./pages/hr/OfferDetail"));

// Auth callback - lazy loaded
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

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
const Drive = lazy(() => import("./pages/portal/Drive"));
const Calendar = lazy(() => import("./pages/portal/Calendar"));
// Analytics page removed - functionality consolidated into dashboard
const Resources = lazy(() => import("./pages/portal/Resources"));
const Requests = lazy(() => import("./pages/portal/Requests"));
const MyTransactions = lazy(() => import("./pages/portal/MyTransactions"));
const CommissionRequest = lazy(() => import("./pages/portal/CommissionRequest"));
const MyCommissionRequests = lazy(() => import("./pages/portal/MyCommissionRequests"));
const MyCommissions = lazy(() => import("./pages/portal/MyCommissions"));
const Tools = lazy(() => import("./pages/portal/Tools"));
const Onboarding = lazy(() => import("./pages/portal/Onboarding"));
const GoogleServicesSettings = lazy(() => import("./pages/portal/GoogleServicesSettings"));
const DealRoom = lazy(() => import("./pages/portal/DealRoom"));
const Chat = lazy(() => import("./pages/portal/Chat"));

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
const NewExclusive = lazy(() => import("./pages/portal/NewExclusive"));
const ExclusiveWizard = lazy(() => import("./pages/portal/exclusives/ExclusiveWizard"));
const Intake = lazy(() => import("./pages/portal/Intake"));
const IntakeForm = lazy(() => import("./pages/intake/IntakeForm"));
const UniversalIntakeForm = lazy(() => import("./pages/intake/UniversalIntakeForm"));
const CommissionRequestsAdmin = lazy(() => import("./pages/admin/CommissionRequestsAdmin"));
const CRMOverviewAdmin = lazy(() => import("./pages/admin/CRMOverviewAdmin"));
const AgentPerformanceAdmin = lazy(() => import("./pages/admin/AgentPerformanceAdmin"));
const ApplicationsAdmin = lazy(() => import("./pages/admin/ApplicationsAdmin"));
const ExclusiveSubmissionsAdmin = lazy(() => import("./pages/admin/ExclusiveSubmissionsAdmin"));
const AgentExpensesAdmin = lazy(() => import("./pages/admin/AgentExpensesAdmin"));
const ErrorDashboard = lazy(() => import("./pages/admin/ErrorDashboard"));

// Service Pages - lazy loaded
const InvestmentSales = lazy(() => import("./pages/services/InvestmentSales"));
const Residential = lazy(() => import("./pages/services/Residential"));
const CommercialLeasing = lazy(() => import("./pages/services/CommercialLeasing"));
const CapitalAdvisory = lazy(() => import("./pages/services/CapitalAdvisory"));
const PropertyManagement = lazy(() => import("./pages/services/PropertyManagement"));
const Billboard = lazy(() => import("./pages/services/Billboard"));
const Marketing = lazy(() => import("./pages/services/Marketing"));

// Optimized QueryClient with better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes (increased for better cache hit rates)
      refetchOnWindowFocus: false,
      refetchOnMount: "always", // Ensure fresh data on mount
      retry: 1,
      networkMode: "online", // Disable offline queuing
    },
    mutations: {
      retry: 0,
      networkMode: "online",
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <DivisionProvider>
                <ContactSheetProvider>
                  <ErrorBoundary>
                    <Toaster />
                    <Sonner />
                  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <SkipLink />
                    <Routes>
                  {/* Root redirects to portal */}
                  <Route path="/" element={<Navigate to="/portal" replace />} />
                  
                  {/* Login & Auth */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/apply" element={
                    <Suspense fallback={<PageLoader />}>
                      {(() => { const Apply = lazy(() => import("./pages/Apply")); return <Apply />; })()}
                    </Suspense>
                  } />
                  <Route path="/apply/success" element={
                    <Suspense fallback={<PageLoader />}>
                      {(() => { const ApplySuccess = lazy(() => import("./pages/ApplySuccess")); return <ApplySuccess />; })()}
                    </Suspense>
                  } />
                  <Route path="/auth/callback" element={
                    <Suspense fallback={<PageLoader />}>
                      <AuthCallback />
                    </Suspense>
                  } />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  
                  {/* Legal Pages */}
                  <Route path="/terms" element={
                    <Suspense fallback={<PageLoader />}>
                      {(() => { const TermsOfService = lazy(() => import("./pages/TermsOfService")); return <TermsOfService />; })()}
                    </Suspense>
                  } />
                  <Route path="/privacy" element={
                    <Suspense fallback={<PageLoader />}>
                      {(() => { const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy")); return <PrivacyPolicy />; })()}
                    </Suspense>
                  } />
                  
                  {/* Public Intake Forms */}
                  <Route path="/intake" element={
                    <Suspense fallback={<PageLoader />}>
                      <UniversalIntakeForm />
                    </Suspense>
                  } />
                  <Route path="/intake/:linkCode" element={
                    <Suspense fallback={<PageLoader />}>
                      <IntakeForm />
                    </Suspense>
                  } />
                  
                  {/* Service Pages (Public) */}
                  <Route path="/services/investment-sales" element={
                    <Suspense fallback={<PageLoader />}>
                      <InvestmentSales />
                    </Suspense>
                  } />
                  <Route path="/services/residential" element={
                    <Suspense fallback={<PageLoader />}>
                      <Residential />
                    </Suspense>
                  } />
                  <Route path="/services/commercial-leasing" element={
                    <Suspense fallback={<PageLoader />}>
                      <CommercialLeasing />
                    </Suspense>
                  } />
                  <Route path="/services/capital-advisory" element={
                    <Suspense fallback={<PageLoader />}>
                      <CapitalAdvisory />
                    </Suspense>
                  } />
                  <Route path="/services/property-management" element={
                    <Suspense fallback={<PageLoader />}>
                      <PropertyManagement />
                    </Suspense>
                  } />
                  <Route path="/services/billboard" element={
                    <Suspense fallback={<PageLoader />}>
                      <Billboard />
                    </Suspense>
                  } />
                  <Route path="/services/marketing" element={
                    <Suspense fallback={<PageLoader />}>
                      <Marketing />
                    </Suspense>
                  } />
                  
                  {/* Investor Login */}
                  <Route path="/investor-login" element={
                    <Suspense fallback={<PageLoader />}>
                      <InvestorLogin />
                    </Suspense>
                  } />
                  
                  {/* Investor Portal Routes */}
                  <Route path="/investor" element={<InvestorLayout />}>
                    <Route index element={<Navigate to="/investor/dashboard" replace />} />
                    <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><InvestorDashboard /></Suspense>} />
                    <Route path="performance" element={<Suspense fallback={<PageLoader />}><InvestorPerformance /></Suspense>} />
                    <Route path="transactions" element={<Suspense fallback={<PageLoader />}><InvestorTransactions /></Suspense>} />
                    <Route path="listings" element={<Suspense fallback={<PageLoader />}><InvestorListings /></Suspense>} />
                    <Route path="team" element={<Suspense fallback={<PageLoader />}><InvestorTeam /></Suspense>} />
                    <Route path="agent-requests" element={<Suspense fallback={<PageLoader />}><InvestorAgentRequests /></Suspense>} />
                    <Route path="commission-requests" element={<Suspense fallback={<PageLoader />}><InvestorCommissionRequests /></Suspense>} />
                    <Route path="commissions" element={<Suspense fallback={<PageLoader />}><InvestorCommissions /></Suspense>} />
                    <Route path="reports" element={<Suspense fallback={<PageLoader />}><InvestorReports /></Suspense>} />
                  </Route>
                  
                  {/* HR Login */}
                  <Route path="/hr/signin" element={
                    <Suspense fallback={<PageLoader />}>
                      <HRSignIn />
                    </Suspense>
                  } />
                  
                  {/* HR Portal Routes */}
                  <Route path="/hr" element={<HRLayout />}>
                    <Route index element={<Navigate to="/hr/dashboard" replace />} />
                    <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><HRDashboard /></Suspense>} />
                    <Route path="agents" element={<Suspense fallback={<PageLoader />}><AgentDatabase /></Suspense>} />
                    <Route path="agents/:id" element={<Suspense fallback={<PageLoader />}><AgentProfile /></Suspense>} />
                    <Route path="pipeline" element={<Suspense fallback={<PageLoader />}><RecruitmentPipeline /></Suspense>} />
                    <Route path="outreach" element={<Suspense fallback={<PageLoader />}><OutreachCampaigns /></Suspense>} />
                    <Route path="outreach/:id" element={<Suspense fallback={<PageLoader />}><CampaignDetail /></Suspense>} />
                    <Route path="interviews" element={<Suspense fallback={<PageLoader />}><Interviews /></Suspense>} />
                    <Route path="interviews/:id" element={<Suspense fallback={<PageLoader />}><InterviewDetail /></Suspense>} />
                    <Route path="offers" element={<Suspense fallback={<PageLoader />}><Offers /></Suspense>} />
                    <Route path="offers/:id" element={<Suspense fallback={<PageLoader />}><OfferDetail /></Suspense>} />
                  </Route>
                  
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
                    <Route path="deal-room" element={
                      <Suspense fallback={<PageLoader />}>
                        <DealRoom />
                      </Suspense>
                    } />
                    <Route path="chat" element={
                      <Suspense fallback={<PageLoader />}>
                        <Chat />
                      </Suspense>
                    } />
                    <Route path="mail" element={
                      <Suspense fallback={<PageLoader />}>
                        <Mail />
                      </Suspense>
                    } />
                    <Route path="drive" element={
                      <Suspense fallback={<PageLoader />}>
                        <Drive />
                      </Suspense>
                    } />
                    <Route path="calendar" element={
                      <Suspense fallback={<PageLoader />}>
                        <Calendar />
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
                    <Route path="exclusives/new" element={
                      <Suspense fallback={<PageLoader />}>
                        <NewExclusive />
                      </Suspense>
                    } />
                    <Route path="exclusives/new/:division" element={
                      <Suspense fallback={<PageLoader />}>
                        <ExclusiveWizard />
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
                    <Route path="my-commissions" element={
                      <Suspense fallback={<PageLoader />}>
                        <MyCommissions />
                      </Suspense>
                    } />
                    <Route path="intake" element={
                      <Suspense fallback={<PageLoader />}>
                        <Intake />
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
                    <Route path="onboarding" element={
                      <Suspense fallback={<PageLoader />}>
                        <Onboarding />
                      </Suspense>
                    } />
                    <Route path="settings/google" element={
                      <Suspense fallback={<PageLoader />}>
                        <GoogleServicesSettings />
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
                    <Route path="applications" element={
                      <Suspense fallback={<PageLoader />}>
                        <ApplicationsAdmin />
                      </Suspense>
                    } />
                    <Route path="exclusive-submissions" element={
                      <Suspense fallback={<PageLoader />}>
                        <ExclusiveSubmissionsAdmin />
                      </Suspense>
                    } />
                    <Route path="agent-expenses" element={
                      <Suspense fallback={<PageLoader />}>
                        <AgentExpensesAdmin />
                      </Suspense>
                    } />
                    <Route path="errors" element={
                      <Suspense fallback={<PageLoader />}>
                        <ErrorDashboard />
                      </Suspense>
                    } />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              </ErrorBoundary>
            </ContactSheetProvider>
          </DivisionProvider>
        </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
