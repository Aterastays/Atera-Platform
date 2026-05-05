import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/useAuth";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { Landing } from "@/pages/Landing";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { NotFound } from "@/pages/NotFound";
import { HubLogin } from "@/pages/hub/Login";
import { HubResetPassword } from "@/pages/hub/ResetPassword";
import { HubLayout } from "@/components/hub/HubLayout";
import { HubDashboard } from "@/pages/hub/Dashboard";
import { HubCommandCentre } from "@/pages/hub/CommandCentre";
import { HubProperties } from "@/pages/hub/Properties";
import { HubCRM } from "@/pages/hub/CRM";
import { HubBookings } from "@/pages/hub/Bookings";
import { HubInbox } from "@/pages/hub/Inbox";
import { HubAnalyser } from "@/pages/hub/Analyser";
import { HubContracts } from "@/pages/hub/Contracts";
import { HubScripts } from "@/pages/hub/Scripts";
import { HubOnboarding } from "@/pages/hub/Onboarding";
import { HubSettings } from "@/pages/hub/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              <Route path="/hub/login" component={HubLogin} />
              <Route path="/hub/reset-password" component={HubResetPassword} />
              <Route path="/hub/:page?">
                <HubLayout>
                  <Switch>
                    <Route path="/hub/dashboard">
                      <ErrorBoundary inline><HubDashboard /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/command">
                      <ErrorBoundary inline><HubCommandCentre /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/properties">
                      <ErrorBoundary inline><HubProperties /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/crm">
                      <ErrorBoundary inline><HubCRM /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/bookings">
                      <ErrorBoundary inline><HubBookings /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/inbox">
                      <ErrorBoundary inline><HubInbox /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/analyser">
                      <ErrorBoundary inline><HubAnalyser /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/contracts">
                      <ErrorBoundary inline><HubContracts /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/scripts">
                      <ErrorBoundary inline><HubScripts /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/onboarding">
                      <ErrorBoundary inline><HubOnboarding /></ErrorBoundary>
                    </Route>
                    <Route path="/hub/settings">
                      <ErrorBoundary inline><HubSettings /></ErrorBoundary>
                    </Route>
                    <Route path="/hub">
                      <ErrorBoundary inline><HubDashboard /></ErrorBoundary>
                    </Route>
                  </Switch>
                </HubLayout>
              </Route>
              <Route component={NotFound} />
            </Switch>
            <CookieBanner />
          </WouterRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
