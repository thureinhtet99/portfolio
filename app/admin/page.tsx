"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Calendar,
  FolderGit2,
  Award,
  LogOut,
  Upload,
  Plus,
  Edit,
  Trash2,
  Save,
  MapPin,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { adminMenuItems } from "@/data/admin/menu-items";

interface Timeline {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  type: "work" | "education";
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("settings");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">
              Admin Portal
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Default password: admin123
                </p>
              </div>
              <Button type="submit" className="w-full h-11">
                Login to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio content
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full md:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Menu</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {adminMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "settings" && <SettingsSection />}
            {activeTab === "timelines" && <TimelinesSection />}
            {activeTab === "projects" && <ProjectsSection />}
            {activeTab === "certificates" && <CertificatesSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [residence, setResidence] = useState("Myanmar");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-6">
            {imagePreview && (
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="w-full max-w-md">
              <Label htmlFor="profile-image" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 hover:border-primary/50 transition-all">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>

            <Button className="w-full max-w-md" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Profile Picture
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Residence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Residence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="residence">Current Location</Label>
            <Input
              id="residence"
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              placeholder="e.g. Myanmar, Singapore, etc."
              className="h-11"
            />
          </div>
          <Button className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Update Residence
          </Button>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume / CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-upload" className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 hover:border-primary/50 transition-all">
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {resumeFile ? resumeFile.name : "Click to upload resume"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF up to 5MB
                </p>
              </div>
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleResumeUpload}
              />
            </Label>
          </div>
          <Button className="w-full" size="lg" disabled={!resumeFile}>
            <Save className="h-4 w-4 mr-2" />
            Upload Resume
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TimelinesSection() {
  const [timelines, setTimelines] = useState<Timeline[]>([
    {
      id: "1",
      title: "Full Stack Developer",
      company: "Tech Company",
      period: "2023 - Present",
      location: "Myanmar",
      description: "Building web applications",
      type: "work",
    },
    {
      id: "2",
      title: "Bachelor of Computer Science",
      company: "University Name",
      period: "2019 - 2023",
      location: "Myanmar",
      description: "Studied computer science fundamentals",
      type: "education",
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTimelineTab, setActiveTimelineTab] = useState<
    "work" | "education"
  >("work");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    period: "",
    location: "",
    description: "",
    type: "work" as "work" | "education",
  });

  const handleAdd = () => {
    if (!formData.title || !formData.company) return;
    const newTimeline: Timeline = {
      id: Date.now().toString(),
      ...formData,
      type: activeTimelineTab,
    };
    setTimelines([...timelines, newTimeline]);
    setFormData({
      title: "",
      company: "",
      period: "",
      location: "",
      description: "",
      type: "work",
    });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setTimelines(timelines.filter((t) => t.id !== id));
  };

  const workTimelines = timelines.filter((t) => t.type === "work");
  const educationTimelines = timelines.filter((t) => t.type === "education");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Manage Timelines
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          value={activeTimelineTab}
          onValueChange={(v) => setActiveTimelineTab(v as "work" | "education")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="work">Work Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="work" className="space-y-4 mt-4">
            <Button
              onClick={() => setIsAdding(!isAdding)}
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>

            {isAdding && activeTimelineTab === "work" && (
              <TimelineForm
                formData={formData}
                setFormData={setFormData}
                onSave={handleAdd}
                onCancel={() => setIsAdding(false)}
              />
            )}

            <div className="space-y-3">
              {workTimelines.map((timeline) => (
                <TimelineCard
                  key={timeline.id}
                  timeline={timeline}
                  onDelete={handleDelete}
                />
              ))}
              {workTimelines.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  No work experience added yet.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-4 mt-4">
            <Button
              onClick={() => setIsAdding(!isAdding)}
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>

            {isAdding && activeTimelineTab === "education" && (
              <TimelineForm
                formData={formData}
                setFormData={setFormData}
                onSave={handleAdd}
                onCancel={() => setIsAdding(false)}
              />
            )}

            <div className="space-y-3">
              {educationTimelines.map((timeline) => (
                <TimelineCard
                  key={timeline.id}
                  timeline={timeline}
                  onDelete={handleDelete}
                />
              ))}
              {educationTimelines.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  No education added yet.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TimelineForm({ formData, setFormData, onSave, onCancel }: any) {
  return (
    <Card className="border-primary/50">
      <CardContent className="pt-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Full Stack Developer"
            />
          </div>
          <div className="space-y-2">
            <Label>Company/Institution *</Label>
            <Input
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="e.g. Tech Company"
            />
          </div>
          <div className="space-y-2">
            <Label>Period</Label>
            <Input
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
              placeholder="e.g. 2023 - Present"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Myanmar"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your role and responsibilities"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCard({
  timeline,
  onDelete,
}: {
  timeline: Timeline;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{timeline.title}</h3>
            <p className="text-muted-foreground">{timeline.company}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {timeline.period && (
                <Badge variant="secondary">{timeline.period}</Badge>
              )}
              {timeline.location && (
                <Badge variant="outline">{timeline.location}</Badge>
              )}
            </div>
            {timeline.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {timeline.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(timeline.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5" />
            Manage Projects
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          Project management interface - Add your projects here
        </div>
      </CardContent>
    </Card>
  );
}

function CertificatesSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Manage Certificates
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          Certificate management interface - Add your certificates here
        </div>
      </CardContent>
    </Card>
  );
}
