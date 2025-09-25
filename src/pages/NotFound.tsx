import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-bg">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>
        
        <Button asChild className="bg-gradient-primary hover:opacity-90">
          <a href="/" className="inline-flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Return to Dashboard
          </a>
        </Button>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Requested path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
