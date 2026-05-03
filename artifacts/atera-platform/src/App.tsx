import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/useAuth";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { Landing } from "@/pages/Landing";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { NotFound } from "@/pages/NotFound";
import { HubLogin } from "@/pages/hub/Login";
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/hub/login" component={HubLogin} />
            <Route path="/hub*">
              <HubLayout>
                <Switch>
                  <Route path="/hub/dashboard" component={HubDashboard} />
                  <Route path="/hub/command" component={HubCommandCentre} />
                  <Route path="/hub/properties" component={HubProperties} />
                  <Route path="/hub/crm" component={HubCRM} />
                  <Route path="/hub/bookings" component={HubBookings} />
                  <Route path="/hub/inbox" component={HubInbox} />
                  <Route path="/hub/analyser" component={HubAnalyser} />
                  <Route path="/hub/contracts" component={HubContracts} />
                  <Route path="/hub/scripts" component={HubScripts} />
                  <Route path="/hub/onboarding" component={HubOnboarding} />
                  <Route path="/hub/settings" component={HubSettings} />
                  <Route path="/hub" component={HubDashboard} />
                </Switch>
              </HubLayout>
            </Route>
            <Route component={NotFound} />
          </Switch>
          <CookieBanner />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
