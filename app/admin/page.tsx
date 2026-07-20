"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";

import { adminMenuItems } from "@/data/admin/menu-items";
import { useSession, signIn, signOut } from "@/lib/auth-client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import CertificatesSection from "./components/CertificateSection";
import ProjectsSection from "./components/ProjectSection";
import SettingsSection from "./components/SettingsSection";
import TimelinesSection from "./components/TimelineSection";

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn.email(
      {
        email,
        password,
        callbackURL: `/${APP_CONFIG.ROUTE.ADMIN}`,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Logged in successfully!");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Login failed");
          console.error(ctx.error);
        },
      },
    );
  };

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

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="surface-panel w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Spinner className="size-8" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="surface-panel w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold tracking-[-0.02em]">
              Admin Portal
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="h-11 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login to Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Welcome back, <b>{session.user?.name || session.user?.email}</b>
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
