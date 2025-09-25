import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Database,
  BarChart3,
  GitBranch,
  Link,
  Leaf,
  Settings,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  {
    title: "Input Data",
    url: "/",
    icon: Database,
    description: "Enter LCA parameters",
  },
  {
    title: "Results",
    url: "/results",
    icon: BarChart3,
    description: "View emissions analysis",
  },
  {
    title: "Scenarios",
    url: "/scenarios",
    icon: GitBranch,
    description: "Compare alternatives",
  },
  {
    title: "Blockchain Log",
    url: "/blockchain",
    icon: Link,
    description: "Process traceability",
  },
];

const secondaryNavItems = [
  {
    title: "Sustainability",
    url: "/sustainability",
    icon: Leaf,
    description: "Environmental metrics",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "System configuration",
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    description: "Documentation",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const active = isActive(path);
    return active
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-l-2 border-sidebar-primary"
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">EcoLCA</h2>
                <p className="text-xs text-sidebar-foreground/60">AI-Powered Analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80">
            Main Functions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} flex items-center space-x-3 px-3 py-2 rounded-md transition-colors`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-sidebar-foreground/60 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80">
            Tools & Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} flex items-center space-x-3 px-3 py-2 rounded-md transition-colors`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-sidebar-foreground/60 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status indicator at bottom */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sidebar-foreground/80">System Active</span>
            </div>
            <div className="text-xs text-sidebar-foreground/60 mt-1">
              AI Model: Random Forest v2.1
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}