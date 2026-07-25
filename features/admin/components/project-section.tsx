import { GitHubContributor } from "@/app/api/github/contributors/route";
import AdminSectionHeader from "@/components/shared/admin-section-header";
import CustomLoading from "@/components/shared/custom-loading";
import DeleteConfirmBox from "@/components/shared/delete-confirm-box";
import EmptyState from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/config/app-config";
import { ProjectCredentialsPanel } from "@/features/projects/components/project-credentials-panel";
import { useCrudResource } from "@/hooks/use-crud";
import { useImageUpload } from "@/hooks/use-image-upload";
import { generateSlug } from "@/lib/utils";
import {
  DemoCredentialType,
  ProjectFormState,
  ProjectType,
} from "@/types/index.type";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  Edit,
  ExternalLink,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

const createEmptyForm = (): ProjectFormState => ({
  slug: "",
  title: "",
  description: "",
  summary: "",
  startDate: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  objectives: "",
  collaborators: "",
  image: "",
  demoUserEmail: "",
  demoUserPassword: "",
  demoAdminEmail: "",
  demoAdminPassword: "",
  featured: false,
});

const hasPartialCredential = (email: string, password: string) =>
  (email.trim() && !password.trim()) || (!email.trim() && password.trim());

const getDemoCredentialsFromForm = (
  formData: ProjectFormState,
): DemoCredentialType[] =>
  [
    {
      role: "User",
      email: formData.demoUserEmail.trim(),
      password: formData.demoUserPassword.trim(),
    },
    {
      role: "Admin",
      email: formData.demoAdminEmail.trim(),
      password: formData.demoAdminPassword.trim(),
    },
  ].filter((credential) => credential.email && credential.password);

export default function ProjectsSection() {
  const {
    items: projects,
    isMutating,
    create,
    update,
    remove,
    reorder,
  } = useCrudResource<ProjectType>({
    resource: APP_CONFIG.ROUTE.PROJECTS,
    labels: { singular: "project", plural: "projects" },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormState>(createEmptyForm());

  const imageUpload = useImageUpload(formData.image || undefined);

  const resetForm = () => {
    setFormData(createEmptyForm());
    imageUpload.reset();
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const buildPayload = async (data: ProjectFormState) => {
    const imageUrl = await imageUpload.upload();
    return {
      slug: data.slug,
      title: data.title,
      description: data.description || undefined,
      summary: data.summary || undefined,
      startDate: data.startDate || undefined,
      technologies: data.technologies
        ? data.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech)
        : undefined,
      githubUrl: data.githubUrl || undefined,
      liveUrl: data.liveUrl || undefined,
      objectives: data.objectives
        ? data.objectives.split("\n").filter((item) => item.trim())
        : undefined,
      collaborators: data.collaborators
        ? data.collaborators.split("\n").filter((item) => item.trim())
        : undefined,
      demoCredentials: getDemoCredentialsFromForm(data),
      image: imageUrl || undefined,
      featured: data.featured,
    };
  };

  const handleSave = async () => {
    if (!formData.slug || !formData.title) {
      toast.error("Please enter a slug and title");
      return;
    }

    if (
      hasPartialCredential(formData.demoUserEmail, formData.demoUserPassword) ||
      hasPartialCredential(formData.demoAdminEmail, formData.demoAdminPassword)
    ) {
      toast.error("Complete both email and password for each demo account");
      return;
    }

    try {
      const payload = await buildPayload(formData);
      if (editingId) {
        await update({ id: editingId, ...payload });
        setEditingId(null);
      } else {
        await create(payload);
        setIsAdding(false);
      }
      resetForm();
    } catch {}
  };

  const handleEdit = (project: ProjectType) => {
    setEditingId(project.id);
    setFormData({
      slug: project.slug,
      title: project.title,
      description: project.description || "",
      summary: project.summary || "",
      startDate: project.startDate || "",
      technologies: project.technologies ? project.technologies.join(", ") : "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      objectives: project.objectives ? project.objectives.join("\n") : "",
      collaborators: project.collaborators
        ? project.collaborators.join("\n")
        : "",
      image: project.image || "",
      demoUserEmail:
        project.demoCredentials?.find(
          (credential) => credential.role.toLowerCase() === "user",
        )?.email || "",
      demoUserPassword:
        project.demoCredentials?.find(
          (credential) => credential.role.toLowerCase() === "user",
        )?.password || "",
      demoAdminEmail:
        project.demoCredentials?.find(
          (credential) => credential.role.toLowerCase() === "admin",
        )?.email || "",
      demoAdminPassword:
        project.demoCredentials?.find(
          (credential) => credential.role.toLowerCase() === "admin",
        )?.password || "",
      featured: project.featured || false,
    });
    imageUpload.reset();
    setIsAdding(false);
  };

  const openDeleteDialog = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    await remove(projectToDelete);
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...projects];
    [reordered[index], reordered[index - 1]] = [
      reordered[index - 1],
      reordered[index],
    ];
    const updates = reordered.map((project, idx) => ({
      id: project.id,
      order: idx,
    }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  const moveDown = async (index: number) => {
    if (index === projects.length - 1) return;
    const reordered = [...projects];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    const updates = reordered.map((project, idx) => ({
      id: project.id,
      order: idx,
    }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  return (
    <Card>
      <AdminSectionHeader
        title="Projects"
        count={projects.length}
        onAdd={() => setIsAdding(!isAdding)}
        addLabel="Add Project"
      />
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <ProjectForm
            formData={formData}
            setFormData={setFormData}
            imageUpload={imageUpload}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isMutating}
            isEditing={!!editingId}
            editingId={editingId}
            generateSlug={generateSlug}
          />
        )}

        <div className="space-y-3">
          {projects.length === 0 && isMutating ? (
            <CustomLoading />
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
                <EmptyState message="No projects added yet." />
              )}
            </>
          )}
        </div>
      </CardContent>

      <DeleteConfirmBox
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        isLoading={isMutating}
        handleDelete={handleDelete}
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </Card>
  );
}

function ProjectForm({
  formData,
  setFormData,
  imageUpload,
  onSave,
  onCancel,
  isLoading,
  isEditing,
  editingId,
  generateSlug,
}: {
  formData: ProjectFormState;
  setFormData: (
    data: ProjectFormState | ((prev: ProjectFormState) => ProjectFormState),
  ) => void;
  imageUpload: ReturnType<typeof useImageUpload>;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
  editingId: string | null;
  generateSlug: (title: string) => string;
}) {
  const { preview, isUploading, onSelectFile } = imageUpload;

  const handleRemoveImage = () => {
    onSelectFile(null);
    setFormData({ ...formData, image: "" });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label>Project Image</Label>
          {preview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={preview}
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
                onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
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
              // onChange={(e) =>
              //   setFormData({ ...formData, title: e.target.value })
              // }
              onChange={(e) => {
                const title = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title,
                  slug: editingId ? prev.slug : generateSlug(title),
                }));
              }}
              placeholder="e.g. Portfolio Website"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g. portfolio-website"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate
                    ? format(new Date(formData.startDate), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    setFormData({
                      ...formData,
                      startDate: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  captionLayout="dropdown-years"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input
              value={formData.githubUrl}
              onChange={(e) =>
                setFormData({ ...formData, githubUrl: e.target.value })
              }
              placeholder="https://github.com/..."
              className="h-11"
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
              className="h-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Technologies (comma separated)</Label>
          <Input
            value={formData.technologies}
            onChange={(e) =>
              setFormData({ ...formData, technologies: e.target.value })
            }
            placeholder="e.g. React, Next.js, TailwindCSS"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Summary</Label>
          <Input
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            placeholder="Briefly describe shortly..."
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <p className="text-xs text-muted-foreground">
            Supports Markdown formatting (e.g., **bold**, *italic*, [links]())
          </p>
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
          <Label>Additional Collaborators (optional)</Label>
          <p className="text-xs text-muted-foreground">
            GitHub contributors are auto-fetched from the repo. Use this field
            only for non-GitHub collaborators.
          </p>
          <Textarea
            value={formData.collaborators}
            onChange={(e) =>
              setFormData({ ...formData, collaborators: e.target.value })
            }
            placeholder="https://github.com/user1&#10;https://github.com/user2"
            rows={3}
          />
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-2">
            <h4 className="text-base font-semibold tracking-[-0.02em]">
              Demo Access
            </h4>
            <p className="text-sm text-muted-foreground">
              These credentials are optional and will be shown publicly on the
              project card and detail view.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm font-medium">Standard User</p>
                <p className="text-xs text-muted-foreground">
                  General browsing account for visitors.
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Input
                    value={formData.demoUserEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        demoUserEmail: e.target.value,
                      })
                    }
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    value={formData.demoUserPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        demoUserPassword: e.target.value,
                      })
                    }
                    placeholder="demo-password"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  Elevated account for testing admin flows.
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Input
                    value={formData.demoAdminEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        demoAdminEmail: e.target.value,
                      })
                    }
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    value={formData.demoAdminPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        demoAdminPassword: e.target.value,
                      })
                    }
                    placeholder="admin-password"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <Label
            htmlFor="featured"
            className="flex items-center justify-between space-x-2 p-4 rounded-lg border cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-base font-medium">Featured Project</span>
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
          </Label>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            size="lg"
            className="flex-1"
            disabled={isLoading || isUploading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            size="lg"
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
  const githubParts = project.githubUrl?.split("/").slice(-2) || [];
  const org = githubParts[0];
  const repo = githubParts[1];

  const { data: githubContributors = [] } = useQuery<GitHubContributor[]>({
    queryKey: ["github-contributors", org, repo],
    queryFn: async () => {
      const res = await fetch(
        `/api/github/contributors?owner=${org}&repo=${repo}`,
      );
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled: !!org && !!repo,
    staleTime: 86400_000,
  });

  const manualCollaborators = project.collaborators || [];

  return (
    <Card
      className={`border border-muted-foreground/20 hover:border-muted-foreground ${isEditing ? "border-primary" : ""}`}
    >
      <CardContent className="px-4">
        <div className="flex flex-col gap-2">
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
            <h3 className="font-semibold text-base sm:text-lg capitalize wrap-break-word">
              {project.title}
            </h3>
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
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-6">
              {project.featured && <Badge>Featured</Badge>}
              {project.startDate && (
                <span className="flex items-center text-xs gap-1">
                  {/* <CalendarIcon className="h-4 w-4" /> */}
                  {format(new Date(project.startDate), "MMM yyyy")}
                </span>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FaGithub className="h-4 w-4" />
                </Link>
              )}

              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
            <ProjectCredentialsPanel
              credentials={project.demoCredentials}
              compact
            />
          </div>

          {/* Description */}
          {project.description && (
            <p className="leading-relaxed wrap-break-word line-clamp-3">
              {project.description}
            </p>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, idx) => (
                <Badge key={idx} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Objectives */}
          {project.objectives && project.objectives.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Objectives:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                {project.objectives.map((objective, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground wrap-break-word leading-relaxed"
                  >
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Collaborators */}
          {(githubContributors.length > 0 ||
            manualCollaborators.length > 0) && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Collaborators:</p>
              <div className="flex flex-wrap gap-3">
                {githubContributors.map((contributor) => (
                  <Link
                    key={contributor.login}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <FaGithub className="h-4 w-4" />
                    {contributor.login}
                    <span className="text-xs text-muted-foreground/60">
                      ({contributor.contributions})
                    </span>
                  </Link>
                ))}
                {manualCollaborators.map((collab, idx) => (
                  <Link
                    key={`manual-${idx}`}
                    href={collab}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <FaGithub className="h-4 w-4" />
                    {collab.replace("https://github.com/", "")}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
