import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppLayout } from "@/components/layout/app-layout";
import Dashboard from "@/pages/dashboard";
import PatientsList from "@/pages/patients/index";
import PatientDetail from "@/pages/patients/[id]";
import DoctorsList from "@/pages/doctors/index";
import DoctorDetail from "@/pages/doctors/[id]";
import AppointmentsList from "@/pages/appointments/index";
import MedicalRecordsList from "@/pages/medical-records/index";
import BillingList from "@/pages/billing/index";
import PharmacyList from "@/pages/pharmacy/index";
import LabReportsList from "@/pages/lab/index";
import ReportsPage from "@/pages/reports/index";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/patients" component={PatientsList} />
        <Route path="/patients/:id" component={PatientDetail} />
        <Route path="/doctors" component={DoctorsList} />
        <Route path="/doctors/:id" component={DoctorDetail} />
        <Route path="/appointments" component={AppointmentsList} />
        <Route path="/medical-records" component={MedicalRecordsList} />
        <Route path="/billing" component={BillingList} />
        <Route path="/pharmacy" component={PharmacyList} />
        <Route path="/lab" component={LabReportsList} />
        <Route path="/reports" component={ReportsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
