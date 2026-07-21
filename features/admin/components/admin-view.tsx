"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { adminMenuItems } from "@/features/admin/data/menu-items";
import { signOut } from "@/lib/auth-client";
import { APP_CONFIG } from "@/config/app-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CertificatesSection from "./certificate-section";
import PostsSection from "./posts-section";
import ProjectsSection from "./project-section";
import SettingsSection from "./settings-section";
import TimelinesSection from "./timeline-section";

type Props = {
  userName: string | null;
};

export function AdminView({ userName }: Props) {
  const [activeTab, setActiveTab] = useState("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setLogoutDialogOpen(true);
          setIsLoading(true);
        },
        onSuccess: () => {
          setLogoutDialogOpen(false);
          router.push(APP_CONFIG.ROUTE.HOME);
          toast.success("Logged out successfully!");
        },
      },
    });
  };

  return (
    <div className="app-shell space-y-6 py-2 md:py-4">
      <div className="surface-panel flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Admin Workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, <b>{userName}</b>
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setLogoutDialogOpen(true)}
          className="w-full md:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="surface-panel h-fit md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1 px-3 pb-3">
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground shadow-[0_14px_30px_-22px_rgba(34,34,34,0.55)]"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          {activeTab === "settings" && <SettingsSection />}
          {activeTab === "timelines" && <TimelinesSection />}
          {activeTab === "projects" && <ProjectsSection />}
          {activeTab === "certificates" && <CertificatesSection />}
          {activeTab === "posts" && <PostsSection />}
        </div>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to
              access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4" />
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
