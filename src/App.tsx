import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import InputData from "./pages/InputData";
import Results from "./pages/Results";
import Scenarios from "./pages/Scenarios";
import Blockchain from "./pages/Blockchain";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<InputData />} />
            <Route path="/results" element={<Results />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/blockchain" element={<Blockchain />} />
            {/* Placeholder routes for secondary nav */}
            <Route path="/sustainability" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Sustainability Metrics</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/help" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Help & Documentation</h2><p className="text-muted-foreground">Coming soon...</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;