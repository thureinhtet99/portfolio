import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineType } from "@/types/index.type";
import { Calendar, Edit, Plus, Save, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import countries from "@/data/countries.json";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { APP_CONFIG } from "@/config/app-config";
import DeleteConfirmBox from "@/components/DeleteConfirmBox";

export default function TimelinesSection() {
  const [timelines, setTimelines] = useState<TimelineType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timelinesLoading, setTimelinesLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timelineToDelete, setTimelineToDelete] = useState<string | null>(null);
  const [activeTimelineTab, setActiveTimelineTab] = useState<
    "work" | "education"
  >("work");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    period: "",
    location: "",
    description: "",
    keyAchievements: "" as string,
    techStacks: "" as string,
    role: "" as "remote" | "on-site" | "internship" | "",
    type: "work" as "work" | "education",
  });

  // Load timelines on mount
  useEffect(() => {
    loadTimelines();
  }, []);

  const loadTimelines = async () => {
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.TIMELINES}`);
      const data = await response.json();
      if (data.success) {
        setTimelines(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load timelines:", error);
      toast.error("Failed to load timelines");
    } finally {
      setTimelinesLoading(false);
    }
  };

  const handleAdd = async () => {
    if (
      !formData.company ||
      (activeTimelineTab === "work" && !formData.title)
    ) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        period: formData.period,
        location: formData.location,
        description: formData.description,
        ...(activeTimelineTab === "work" && {
          keyAchievements: formData.keyAchievements
            ? formData.keyAchievements.split("\n").filter((item) => item.trim())
            : undefined,
          techStacks: formData.techStacks
            ? formData.techStacks
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech)
            : undefined,
          role: formData.role || undefined,
        }),
        type: activeTimelineTab,
      };

      const response = await fetch(`/api/${APP_CONFIG.ROUTE.TIMELINES}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadTimelines();
        resetForm();
        setIsAdding(false);
        toast.success("Timeline added successfully!");
      } else {
        throw new Error(data.error || "Failed to add timeline");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add timeline";
      toast.error(errorMessage);
      console.error("Add timeline error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (timeline: TimelineType) => {
    setEditingId(timeline.id);
    setFormData({
      title: timeline.title,
      company: timeline.company,
      period: timeline.period || "",
      location: timeline.location || "",
      description: timeline.description || "",
      keyAchievements: timeline.keyAchievements
        ? timeline.keyAchievements.join("\n")
        : "",
      techStacks: timeline.techStacks ? timeline.techStacks.join(", ") : "",
      role: timeline.role || "",
      type: timeline.type,
    });
    setActiveTimelineTab(timeline.type);
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.company || !editingId) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: editingId,
        title: formData.title,
        company: formData.company,
        period: formData.period,
        location: formData.location,
        description: formData.description,
        ...(activeTimelineTab === "work" && {
          keyAchievements: formData.keyAchievements
            ? formData.keyAchievements.split("\n").filter((item) => item.trim())
            : undefined,
          techStacks: formData.techStacks
            ? formData.techStacks
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech)
            : undefined,
          role: formData.role || undefined,
        }),
        type: activeTimelineTab,
      };

      const response = await fetch(`/api/${APP_CONFIG.ROUTE.TIMELINES}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadTimelines();
        resetForm();
        setEditingId(null);
        toast.success("Timeline updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update timeline");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update timeline";
      toast.error(errorMessage);
      console.error("Update timeline error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setTimelineToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!timelineToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/${APP_CONFIG.ROUTE.TIMELINES}?id=${timelineToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        await loadTimelines();
        setDeleteDialogOpen(false);
        setTimelineToDelete(null);
        toast.success("Timeline deleted successfully!");
      } else {
        throw new Error(data.error || "Failed to delete timeline");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete timeline";
      toast.error(errorMessage);
      console.error("Delete timeline error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      period: "",
      location: "",
      description: "",
      keyAchievements: "",
      techStacks: "",
      role: "",
      type: "work",
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const workTimelines = timelines.filter((t) => t.type === "work");
  const educationTimelines = timelines.filter((t) => t.type === "education");

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Manage Timeline
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

            {(isAdding || editingId) && activeTimelineTab === "work" && (
              <TimelineForm
                activeTimelineTab={activeTimelineTab}
                formData={formData}
                setFormData={setFormData}
                onSave={editingId ? handleUpdate : handleAdd}
                onCancel={handleCancel}
                isLoading={isLoading}
                isEditing={!!editingId}
              />
            )}

            <div className="space-y-3">
              {timelinesLoading ? (
                // Loading skeleton
                Array.from({ length: 2 }).map((_, idx) => (
                  <Card key={idx} className="animate-pulse">
                    <CardContent className="p-3 sm:p-4">
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
                  {workTimelines.map((timeline) => (
                    <TimelineCard
                      key={timeline.id}
                      timeline={timeline}
                      onEdit={handleEdit}
                      onDelete={openDeleteDialog}
                      isEditing={editingId === timeline.id}
                    />
                  ))}
                  {workTimelines.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">
                      No work experience added yet.
                    </p>
                  )}
                </>
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

            {(isAdding || editingId) && activeTimelineTab === "education" && (
              <TimelineForm
                activeTimelineTab={activeTimelineTab}
                formData={formData}
                setFormData={setFormData}
                onSave={editingId ? handleUpdate : handleAdd}
                onCancel={handleCancel}
                isLoading={isLoading}
                isEditing={!!editingId}
              />
            )}

            <div className="space-y-3">
              {timelinesLoading ? (
                // Loading skeleton
                Array.from({ length: 2 }).map((_, idx) => (
                  <Card key={idx} className="animate-pulse">
                    <CardContent className="p-3 sm:p-4">
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
                  {educationTimelines.map((timeline) => (
                    <TimelineCard
                      key={timeline.id}
                      timeline={timeline}
                      onEdit={handleEdit}
                      onDelete={openDeleteDialog}
                      isEditing={editingId === timeline.id}
                    />
                  ))}
                  {educationTimelines.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">
                      No education added yet.
                    </p>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Delete dialog */}
      <DeleteConfirmBox
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        isLoading={isLoading}
        handleDelete={handleDelete}
      />
    </Card>
  );
}

function TimelineForm({
  activeTimelineTab,
  formData,
  setFormData,
  onSave,
  onCancel,
  isLoading,
  isEditing,
}: {
  activeTimelineTab: "work" | "education";
  formData: {
    title: string;
    company: string;
    period: string;
    location: string;
    description: string;
    keyAchievements: string;
    techStacks: string;
    role: "remote" | "on-site" | "internship" | "";
    type: "work" | "education";
  };
  setFormData: (data: {
    title: string;
    company: string;
    period: string;
    location: string;
    description: string;
    keyAchievements: string;
    techStacks: string;
    role: "remote" | "on-site" | "internship" | "";
    type: "work" | "education";
  }) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              {activeTimelineTab === "work" ? "Title *" : "Degree/Title"}
            </Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={
                activeTimelineTab === "work"
                  ? "e.g. Full Stack Developer"
                  : "e.g. Bachelor of Computer Science"
              }
            />
          </div>
          <div className="space-y-2">
            <Label>
              {activeTimelineTab === "work"
                ? "Company/Institution *"
                : "University/College *"}
            </Label>
            <Input
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder={`e.g. ${
                activeTimelineTab === "work"
                  ? "Tech Company"
                  : "Greenwish University"
              }`}
            />
          </div>
          <div className="space-y-2">
            <Label>Period *</Label>
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
              list="timeline-countries-list"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Myanmar"
            />
            <datalist id="timeline-countries-list">
              {countries.map((country) => (
                <option key={country.code} value={country.name} />
              ))}
            </datalist>
          </div>
          {activeTimelineTab === "work" && (
            <div className="space-y-2">
              <Label>Work Mode</Label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as
                      | "remote"
                      | "on-site"
                      | "internship"
                      | "",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled selected>
                  Select work mode
                </option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          )}
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
        {activeTimelineTab === "work" && (
          <>
            <div className="space-y-2">
              <Label>Key Achievements (one per line)</Label>
              <Textarea
                value={formData.keyAchievements}
                onChange={(e) =>
                  setFormData({ ...formData, keyAchievements: e.target.value })
                }
                placeholder="• Achievement 1&#10;• Achievement 2&#10;• Achievement 3"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Tech Stacks (comma separated)</Label>
              <Textarea
                value={formData.techStacks}
                onChange={(e) =>
                  setFormData({ ...formData, techStacks: e.target.value })
                }
                placeholder="e.g. React, Node.js, MongoDB, Docker"
                rows={2}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex-1" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
          <Button onClick={onCancel} variant="outline" disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCard({
  timeline,
  onEdit,
  onDelete,
  isEditing,
}: {
  timeline: TimelineType;
  onEdit: (timeline: TimelineType) => void;
  onDelete: (id: string) => void;
  isEditing?: boolean;
}) {
  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        isEditing ? "border-primary" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          {/* Header with title, company and action buttons */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg capitalize break-words">
                {timeline.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 break-words">
                {timeline.company}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(timeline)}
                className="h-9 w-9 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(timeline.id)}
                className="h-9 w-9 p-0"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {timeline.period && (
              <Badge variant="secondary" className="text-xs">
                {timeline.period}
              </Badge>
            )}
            {timeline.location && (
              <Badge variant="outline" className="text-xs">
                {timeline.location}
              </Badge>
            )}
            {timeline.role && timeline.type === "work" && (
              <Badge
                variant="default"
                className={`text-xs ${
                  timeline.role === "remote"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : timeline.role === "on-site"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
              >
                {timeline.role === "on-site"
                  ? "On-site"
                  : timeline.role.charAt(0).toUpperCase() +
                    timeline.role.slice(1)}
              </Badge>
            )}
          </div>

          {/* Description */}
          {timeline.description && (
            <p className="text-sm text-muted-foreground leading-relaxed break-words">
              {timeline.description}
            </p>
          )}

          {/* Key Achievements */}
          {timeline.type === "work" &&
            timeline.keyAchievements &&
            timeline.keyAchievements.length > 0 && (
              <div className="mt-1">
                <p className="text-sm font-medium mb-2">Key Achievements:</p>
                <ul className="list-disc list-inside space-y-1.5 text-sm">
                  {timeline.keyAchievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      className="text-muted-foreground break-words leading-relaxed"
                    >
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Tech Stacks */}
          {timeline.type === "work" &&
            timeline.techStacks &&
            timeline.techStacks.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {timeline.techStacks.map((tech, idx) => (
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
        </div>
      </CardContent>
    </Card>
  );
}
