import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ProjectType } from "@/types/index.type";
import {
  FolderGit2,
  Plus,
  Save,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { APP_CONFIG } from "@/config/app-config";
import DeleteConfirmBox from "@/components/DeleteConfirmBox";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    objectives: "",
    keyChallenges: "",
    image: "",
    featured: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.PROJECTS}`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = formData.image;

      // Upload image if a new file is selected
      if (imageFile) {
        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        formDataUpload.append("type", "image");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || "Image upload failed");
        }
        setIsUploading(false);
      }

      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        technologies: formData.technologies
          ? formData.technologies
              .split(",")
              .map((tech) => tech.trim())
              .filter((tech) => tech)
          : undefined,
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        objectives: formData.objectives
          ? formData.objectives.split("\n").filter((item) => item.trim())
          : undefined,
        keyChallenges: formData.keyChallenges
          ? formData.keyChallenges.split("\n").filter((item) => item.trim())
          : undefined,
        image: imageUrl || undefined,
        featured: formData.featured,
      };

      const response = await fetch(`/api/${APP_CONFIG.ROUTE.PROJECTS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadProjects();
        resetForm();
        setIsAdding(false);
        toast.success("Project added successfully!");
      } else {
        throw new Error(data.error || "Failed to add project");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add project";
      toast.error(errorMessage);
      console.error("Add project error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: ProjectType) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || "",
      technologies: project.technologies ? project.technologies.join(", ") : "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      objectives: project.objectives ? project.objectives.join("\n") : "",
      keyChallenges: project.keyChallenges
        ? project.keyChallenges.join("\n")
        : "",
      image: project.image || "",
      featured: project.featured || false,
    });
    setImagePreview(project.image || null);
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (!formData.title || !editingId) {
      toast.error("Please enter a title");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = formData.image;

      // Upload image if a new file is selected
      if (imageFile) {
        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        formDataUpload.append("type", "image");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || "Image upload failed");
        }
        setIsUploading(false);
      }

      const payload = {
        id: editingId,
        title: formData.title,
        description: formData.description || undefined,
        technologies: formData.technologies
          ? formData.technologies
              .split(",")
              .map((tech) => tech.trim())
              .filter((tech) => tech)
          : undefined,
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        objectives: formData.objectives
          ? formData.objectives.split("\n").filter((item) => item.trim())
          : undefined,
        keyChallenges: formData.keyChallenges
          ? formData.keyChallenges.split("\n").filter((item) => item.trim())
          : undefined,
        image: imageUrl || undefined,
        featured: formData.featured,
      };

      const response = await fetch(`/api/${APP_CONFIG.ROUTE.PROJECTS}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadProjects();
        resetForm();
        setEditingId(null);
        toast.success("Project updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update project");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update project";
      toast.error(errorMessage);
      console.error("Update project error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/${APP_CONFIG.ROUTE.PROJECTS}?id=${projectToDelete}`,
        { method: "DELETE" }
      );

      const data = await response.json();
      if (data.success) {
        await loadProjects();
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        toast.success("Project deleted successfully!");
      } else {
        throw new Error(data.error || "Failed to delete project");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete project";
      toast.error(errorMessage);
      console.error("Delete project error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;

    const newProjects = [...projects];
    [newProjects[index], newProjects[index - 1]] = [
      newProjects[index - 1],
      newProjects[index],
    ];

    // Update order values
    const updatedProjects = newProjects.map((project, idx) => ({
      id: project.id,
      order: idx,
    }));

    setIsLoading(true);
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.PROJECTS}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updatedProjects }),
      });

      const data = await response.json();
      if (data.success) {
        await loadProjects();
        toast.success("Order updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update order");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      toast.error(errorMessage);
      console.error("Update order error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const moveDown = async (index: number) => {
    if (index === projects.length - 1) return;

    const newProjects = [...projects];
    [newProjects[index], newProjects[index + 1]] = [
      newProjects[index + 1],
      newProjects[index],
    ];

    // Update order values
    const updatedProjects = newProjects.map((project, idx) => ({
      id: project.id,
      order: idx,
    }));

    setIsLoading(true);
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.PROJECTS}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updatedProjects }),
      });

      const data = await response.json();
      if (data.success) {
        await loadProjects();
        toast.success("Order updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update order");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      toast.error(errorMessage);
      console.error("Update order error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      objectives: "",
      keyChallenges: "",
      image: "",
      featured: false,
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5" />
            Manage Projects
          </CardTitle>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <ProjectForm
            formData={formData}
            setFormData={setFormData}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            imageFile={imageFile}
            setImageFile={setImageFile}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            onSave={editingId ? handleUpdate : handleAdd}
            onCancel={handleCancel}
            isLoading={isLoading}
            isEditing={!!editingId}
          />
        )}

        <div className="space-y-3">
          {projectsLoading ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-20" />
                      <div className="h-6 bg-muted rounded w-24" />
                    </div>
                    <div className="h-16 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {projects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={openDeleteDialog}
                  onMoveUp={() => moveUp(idx)}
                  onMoveDown={() => moveDown(idx)}
                  isEditing={editingId === project.id}
                  isFirst={idx === 0}
                  isLast={idx === projects.length - 1}
                />
              ))}
              {projects.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderGit2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>
                    No projects added yet. Click &quot;Add Project&quot; to get
                    started.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      <DeleteConfirmBox
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        isLoading={isLoading}
        handleDelete={handleDelete}
      />
    </Card>
  );
}

function ProjectForm({
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  // imageFile,
  setImageFile,
  isUploading,
  // setIsUploading,
  onSave,
  onCancel,
  isLoading,
  isEditing,
}: {
  formData: {
    title: string;
    description: string;
    technologies: string;
    githubUrl: string;
    liveUrl: string;
    objectives: string;
    keyChallenges: string;
    image: string;
    featured: boolean;
  };
  setFormData: (data: {
    title: string;
    description: string;
    technologies: string;
    githubUrl: string;
    liveUrl: string;
    objectives: string;
    keyChallenges: string;
    image: string;
    featured: boolean;
  }) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file for later upload
    setImageFile(file);

    // Show preview only
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData({ ...formData, image: "" });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-6 space-y-4">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label>Project Image</Label>
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={imagePreview}
                alt="Project preview"
                fill
                className="object-cover"
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Label htmlFor="project-image" className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 hover:border-primary/50 transition-all">
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Click to upload project image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
              <Input
                id="project-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </Label>
          )}
          {isUploading && (
            <p className="text-sm text-primary text-center font-medium">
              Uploading image...
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Portfolio Website"
            />
          </div>
          <div className="space-y-2">
            <Label>Technologies (comma separated)</Label>
            <Input
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              placeholder="e.g. React, Next.js, TailwindCSS"
            />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input
              value={formData.githubUrl}
              onChange={(e) =>
                setFormData({ ...formData, githubUrl: e.target.value })
              }
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label>Live URL</Label>
            <Input
              value={formData.liveUrl}
              onChange={(e) =>
                setFormData({ ...formData, liveUrl: e.target.value })
              }
              placeholder="https://..."
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
            placeholder="Describe your project..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label>Objectives (one per line)</Label>
          <Textarea
            value={formData.objectives}
            onChange={(e) =>
              setFormData({ ...formData, objectives: e.target.value })
            }
            placeholder="• Objective 1&#10;• Objective 2&#10;• Objective 3"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label>Key Challenges (one per line)</Label>
          <Textarea
            value={formData.keyChallenges}
            onChange={(e) =>
              setFormData({ ...formData, keyChallenges: e.target.value })
            }
            placeholder="• Challenge 1&#10;• Challenge 2&#10;• Challenge 3"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
          <div className="space-y-0.5">
            <Label htmlFor="featured" className="text-base font-medium">
              Featured Project
            </Label>
            <p className="text-sm text-muted-foreground">
              Display this project on the homepage
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, featured: checked })
            }
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            className="flex-1"
            disabled={isLoading || isUploading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isLoading || isUploading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isEditing,
  isFirst,
  isLast,
}: {
  project: ProjectType;
  onEdit: (project: ProjectType) => void;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEditing?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        isEditing ? "border-primary" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          {/* Project Image */}
          {project.image && (
            <div className="w-full h-48 relative rounded-md overflow-hidden bg-muted">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base sm:text-lg capitalize break-words">
                  {project.title}
                </h3>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={onMoveUp}
                disabled={isFirst}
                className="h-9 w-9 p-0"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onMoveDown}
                disabled={isLast}
                className="h-9 w-9 p-0"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(project)}
                className="h-9 w-9 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(project.id)}
                className="h-9 w-9 p-0"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.featured && (
              <Badge variant="secondary" className="capitalize text-xs">
                Featured
              </Badge>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}

            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live
              </Link>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-muted-foreground leading-relaxed break-words">
              {project.description}
            </p>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, idx) => (
                <Badge
                  key={idx}
                  variant="default"
                  className="capitalize text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Objectives */}
          {project.objectives && project.objectives.length > 0 && (
            <div className="mt-1">
              <p className="text-sm font-medium mb-2">Objectives:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                {project.objectives.map((objective, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground break-words leading-relaxed"
                  >
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Challenges */}
          {project.keyChallenges && project.keyChallenges.length > 0 && (
            <div className="mt-1">
              <p className="text-sm font-medium mb-2">Key Challenges:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                {project.keyChallenges.map((challenge, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground break-words leading-relaxed"
                  >
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
