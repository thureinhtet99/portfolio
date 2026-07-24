"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { APP_CONFIG } from "@/config/app-config";
import { adminMenuItems } from "@/features/admin/data/menu-items";
import { signOut } from "@/lib/auth-client";

import CertificatesSection from "./certificate-section";
import PostsSection from "./posts-section";
import ProjectsSection from "./project-section";
import SettingsSection from "./settings-section";
import TimelinesSection from "./timeline-section";

export function AdminView({ userName }: { userName: string | null }) {
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
      <div className="surface-panel flex flex-row items-center justify-between px-6">
        <h2>
          Welcome back,{" "}
          <b className="text-muted-foreground text-xl">{userName}</b>
        </h2>

        <Button
          variant="outline"
          onClick={() => setLogoutDialogOpen(true)}
          className="w-auto rounded-md"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="surface-panel h-fit md:col-span-1 border-none">
          <CardHeader>
            <CardTitle className="text-lg">Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-1">
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 cursor-pointer rounded-md px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-muted"
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
          <DialogFooter className="gap-y-2">
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
