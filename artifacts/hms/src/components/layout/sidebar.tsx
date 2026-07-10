import { Link, useLocation } from "wouter";
import { Activity, Calendar, LayoutDashboard, Pill, Receipt, Stethoscope, TestTube, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Doctors", href: "/doctors", icon: Stethoscope },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Medical Records", href: "/medical-records", icon: Activity },
  { name: "Billing", href: "/billing", icon: Receipt },
  { name: "Pharmacy", href: "/pharmacy", icon: Pill },
  { name: "Lab Reports", href: "/lab", icon: TestTube },
  { name: "Reports", href: "/reports", icon: Activity }, // Assuming Activity is ok, maybe BarChart
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-foreground">HMS Platform</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-medium text-sm">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">Admin User</span>
            <span className="text-xs text-sidebar-foreground/60">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
