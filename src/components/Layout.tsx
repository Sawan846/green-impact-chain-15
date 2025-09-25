import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-bg">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  LCA Dashboard
                </h1>
                <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span>AI Model Active</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}