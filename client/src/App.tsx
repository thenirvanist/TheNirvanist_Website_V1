import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Journeys from "@/pages/Journeys";
import JourneyDetail from "@/pages/JourneyDetail";
import Meetups from "@/pages/Meetups";
import Sages from "@/pages/Sages";
import SageDetail from "@/pages/SageDetail";
import Ashrams from "@/pages/Ashrams";
import AshramDetail from "@/pages/AshramDetail";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Chatbot from "@/components/Chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/journeys" component={Journeys} />
      <Route path="/journeys/:id" component={JourneyDetail} />
      <Route path="/meetups" component={Meetups} />
      <Route path="/sages" component={Sages} />
      <Route path="/sages/:id" component={SageDetail} />
      <Route path="/ashrams" component={Ashrams} />
      <Route path="/ashrams/:id" component={AshramDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <Chatbot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
