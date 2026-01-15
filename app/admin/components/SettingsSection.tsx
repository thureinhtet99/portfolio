import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/config/app-config";
import { Label } from "@radix-ui/react-label";
import {
  FileText,
  MapPin,
  Save,
  Upload,
  User,
  Github,
  Facebook,
  Linkedin,
  Link,
  MessageSquare,
  Briefcase,
  Circle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import countries from "@/data/countries.json";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

export default function SettingsSection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [residence, setResidence] = useState("Myanmar");
  const [available, setAvailable] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [githubUrl, setGithubUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [intro, setIntro] = useState("");
  const [roles, setRoles] = useState("");

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`);
      const data = await response.json();
      if (data.success && data.data) {
        setResidence(data.data.residence || "Myanmar");
        setAvailable(
          data.data.available === "true" || data.data.available === true
        );
        setResumeUrl(data.data.resume || null);
        setGithubUrl(data.data.githubUrl || "");
        setFacebookUrl(data.data.facebookUrl || "");
        setLinkedinUrl(data.data.linkedinUrl || "");
        setAboutMe(data.data.aboutMe || "");
        setIntro(data.data.intro || "");
        setRoles(data.data.roles || "");
        if (data.data.profileImage) {
          setImagePreview(data.data.profileImage);
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setImageLoading(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

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

  const handleSaveProfileImage = async () => {
    const fileInput = document.getElementById(
      "profile-image"
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // Save URL to database
      const saveRes = await fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "profileImage",
          value: uploadData.url,
        }),
      });

      const saveData = await saveRes.json();
      if (saveData.success) {
        toast.success("Profile picture saved successfully!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save profile picture";
      toast.error(errorMessage);
      console.error("Profile upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      toast.success("Resume selected");
    } else {
      toast.error("Please select a PDF file");
    }
  };

  const handleSaveResume = async () => {
    if (!resumeFile) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("type", "pdf");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error("Upload failed");
      }

      // Save URL to database
      const saveRes = await fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "resume",
          value: uploadData.url,
        }),
      });

      const saveData = await saveRes.json();
      if (saveData.success) {
        setResumeUrl(uploadData.url);
        toast.success("Resume uploaded successfully!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload resume";
      toast.error(errorMessage);
      console.error("Resume upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveResidence = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "residence",
          value: residence,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Residence updated successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to update residence");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvailableToggle = async (checked: boolean) => {
    setAvailable(checked);
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "available",
          value: String(checked),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          `Availability status ${checked ? "enabled" : "disabled"}!`
        );
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to update availability");
      setAvailable(!checked); // Revert on error
    }
  };

  const handleSaveSocialLinks = async () => {
    setIsSaving(true);
    try {
      const promises = [
        fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "githubUrl",
            value: githubUrl,
          }),
        }),
        fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "facebookUrl",
            value: facebookUrl,
          }),
        }),
        fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "linkedinUrl",
            value: linkedinUrl,
          }),
        }),
      ];

      const responses = await Promise.all(promises);
      const allSuccess = responses.every(async (res) => {
        const data = await res.json();
        return data.success;
      });

      if (allSuccess) {
        toast.success("Social links updated successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to update social links");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAboutIntro = async () => {
    setIsSaving(true);
    try {
      const promises = [
        fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "aboutMe",
            value: aboutMe,
          }),
        }),
        fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "intro",
            value: intro,
          }),
        }),
      ];

      const responses = await Promise.all(promises);
      const allSuccess = responses.every(async (res) => {
        const data = await res.json();
        return data.success;
      });

      if (allSuccess) {
        toast.success("About & Intro updated successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to update About & Intro");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRoles = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "roles",
          value: roles,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Roles updated successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to update roles");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-6">
            {imageLoading ? (
              <div className="w-48 h-48 rounded-full border-4 border-primary/20 shadow-lg bg-muted animate-pulse" />
            ) : (
              imagePreview && (
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )
            )}

            <div className="w-full max-w-md flex justify-center items-center">
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

            <Button
              className="w-full max-w-md"
              size="lg"
              disabled={!imagePreview || isUploading}
              onClick={handleSaveProfileImage}
            >
              <Save className="h-4 w-4" />
              {isUploading ? (
                <>
                  Uploading...
                  <Spinner />
                </>
              ) : (
                "Save Profile Picture"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roles">Roles (comma-separated)</Label>
            <Input
              id="roles"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              placeholder="e.g. Frontend Developer, Backend Developer, Fullstack Developer"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              These roles will be displayed in the typing animation on your
              homepage
            </p>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleSaveRoles}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? (
              <>
                Updating...
                <Spinner />
              </>
            ) : (
              "Update Roles"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Available for Work */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="h-5 w-5" />
            Availability Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <Label
                htmlFor="available"
                className="text-base font-medium cursor-pointer"
              >
                Available for Work
              </Label>
              <p className="text-sm text-muted-foreground">
                Show availability status on your homepage
              </p>
            </div>
            <Switch
              id="available"
              checked={available}
              onCheckedChange={handleAvailableToggle}
            />
          </div>
          {available ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
              <Circle className="h-4 w-4 fill-green-500 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                Currently showing as available on homepage
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
              <Circle className="h-4 w-4 fill-red-500 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400 font-medium">
                Currently showing as available on homepage
              </span>
            </div>
          )}
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
              list="countries-list"
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              placeholder="Select or type your country..."
              className="h-11 capitalize"
            />
            <datalist id="countries-list">
              {countries.map((country) => (
                <option key={country.code} value={country.name} />
              ))}
            </datalist>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleSaveResidence}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? (
              <>
                Updating...
                <Spinner />
              </>
            ) : (
              "Update Residence"
            )}
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
          {resumeUrl && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Current Resume:
              </p>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                View Resume
              </a>
            </div>
          )}
          <div className="space-y-2 flex items-center justify-center">
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
          <Button
            className="w-full"
            size="lg"
            disabled={!resumeFile || isUploading}
            onClick={handleSaveResume}
          >
            <Save className="h-4 w-4 mr-2" />
            {isUploading ? (
              <>
                Uploading...
                <Spinner />
              </>
            ) : (
              "Upload Resume"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* About Me & Intro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            About & Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intro">Introduction</Label>
            <p className="text-xs text-muted-foreground">
              Supports Markdown formatting (e.g., **bold**, *italic*, [links]())
            </p>
            <Textarea
              id="intro"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="Write a brief introduction about yourself...&#10;&#10;Example:&#10;Hi! I'm a **Full Stack Developer** with expertise in *React* and *Node.js*."
              rows={6}
              className="resize-y font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutMe">About Me</Label>
            <p className="text-xs text-muted-foreground">
              Supports Markdown formatting (e.g., **bold**, *italic*, [links](),
              lists)
            </p>
            <Textarea
              id="aboutMe"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Write detailed information about yourself...&#10;&#10;Example:&#10;## Background&#10;I have **5 years** of experience in web development.&#10;&#10;## Skills&#10;- React & Next.js&#10;- Node.js & Express&#10;- Database Design"
              rows={12}
              className="resize-y font-mono text-sm"
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleSaveAboutIntro}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? (
              <>
                Updating...
                <Spinner />
              </>
            ) : (
              "Update About & Intro"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub URL
            </Label>
            <Input
              id="github"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook URL
            </Label>
            <Input
              id="facebook"
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/username"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="h-11"
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleSaveSocialLinks}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? (
              <>
                Updating...
                <Spinner />
              </>
            ) : (
              "Update Social Links"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
