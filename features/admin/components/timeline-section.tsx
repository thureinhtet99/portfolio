import DeleteConfirmBox from "@/components/shared/delete-confirm-box";
import EmptyState from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/config/app-config";
import countries from "@/data/countries.json";
import { useCrudResource } from "@/hooks/use-crud";
import { TimelineType } from "@/types/index.type";
import { ArrowDown, ArrowUp, Edit, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PositionForm = {
  id: string;
  title: string;
  start: string;
  end: string;
  employmentType: string;
  description: string;
  skills: string;
};

type WorkFormData = {
  companyName: string;
  companyLogo: string;
  companyWebsite: string;
  isCurrentEmployer: boolean;
  positions: PositionForm[];
};

type EducationFormData = {
  institution: string;
  location: string;
  period: string;
};

const emptyPosition = (): PositionForm => ({
  id: `pos_${Date.now()}`,
  title: "",
  start: "",
  end: "",
  employmentType: "",
  description: "",
  skills: "",
});

export default function TimelinesSection() {
  const {
    items: timelines,
    isMutating,
    create,
    update,
    reorder,
    invalidate,
  } = useCrudResource<TimelineType>({
    resource: APP_CONFIG.ROUTE.TIMELINES,
    labels: { singular: "timeline", plural: "timelines" },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timelineToDelete, setTimelineToDelete] = useState<{
    id: string;
    type: "work" | "education";
  } | null>(null);
  const [activeTimelineTab, setActiveTimelineTab] = useState<
    "work" | "education"
  >("work");
  const [workForm, setWorkForm] = useState<WorkFormData>({
    companyName: "",
    companyLogo: "",
    companyWebsite: "",
    isCurrentEmployer: false,
    positions: [emptyPosition()],
  });
  const [educationForm, setEducationForm] = useState<EducationFormData>({
    institution: "",
    location: "",
    period: "",
  });

  useEffect(() => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  }, [activeTimelineTab]);

  const resetForm = () => {
    setWorkForm({
      companyName: "",
      companyLogo: "",
      companyWebsite: "",
      isCurrentEmployer: false,
      positions: [emptyPosition()],
    });
    setEducationForm({ institution: "", location: "", period: "" });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const addPosition = () => {
    setWorkForm({
      ...workForm,
      positions: [...workForm.positions, emptyPosition()],
    });
  };

  const removePosition = (idx: number) => {
    if (workForm.positions.length <= 1) return;
    setWorkForm({
      ...workForm,
      positions: workForm.positions.filter((_, i) => i !== idx),
    });
  };

  const updatePosition = (
    idx: number,
    field: keyof PositionForm,
    value: string,
  ) => {
    const updated = [...workForm.positions];
    updated[idx] = { ...updated[idx], [field]: value };
    setWorkForm({ ...workForm, positions: updated });
  };

  const handleSave = async () => {
    if (activeTimelineTab === "work") {
      if (!workForm.companyName) {
        toast.error("Company name is required");
        return;
      }
      if (workForm.positions.some((p) => !p.title)) {
        toast.error("All positions need a title");
        return;
      }
    } else {
      if (!educationForm.institution) {
        toast.error("Institution is required");
        return;
      }
    }

    setIsSaving(true);
    try {
      let payload;
      if (activeTimelineTab === "work") {
        payload = {
          companyName: workForm.companyName,
          companyLogo: workForm.companyLogo || undefined,
          companyWebsite: workForm.companyWebsite || undefined,
          isCurrentEmployer: workForm.isCurrentEmployer,
          positions: workForm.positions.map((p) => ({
            id: p.id,
            title: p.title,
            employmentPeriod: {
              start: p.start,
              end: p.end || undefined,
            },
            employmentType: p.employmentType || undefined,
            description: p.description || undefined,
            skills: p.skills
              ? p.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : undefined,
          })),
          type: "work" as const,
        };
      } else {
        payload = {
          institution: educationForm.institution,
          location: educationForm.location || undefined,
          period: educationForm.period || undefined,
          type: "education" as const,
        };
      }

      if (editingId) {
        await update({ id: editingId, ...payload });
        setEditingId(null);
      } else {
        await create(payload);
        setIsAdding(false);
      }
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (timeline: TimelineType) => {
    setEditingId(timeline.id);

    if (timeline.type === "work") {
      const t = timeline as Extract<TimelineType, { type: "work" }>;
      setWorkForm({
        companyName: t.companyName,
        companyLogo: t.companyLogo || "",
        companyWebsite: t.companyWebsite || "",
        isCurrentEmployer: t.isCurrentEmployer || false,
        positions: t.positions?.map((p) => ({
          id: p.id,
          title: p.title,
          start: p.employmentPeriod?.start || "",
          end: p.employmentPeriod?.end || "",
          employmentType: p.employmentType || "",
          description: p.description || "",
          skills: p.skills?.join(", ") || "",
        })) || [emptyPosition()],
      });
      setActiveTimelineTab("work");
    } else {
      const t = timeline as Extract<TimelineType, { type: "education" }>;
      setEducationForm({
        institution: t.institution,
        location: t.location || "",
        period: t.period || "",
      });
      setActiveTimelineTab("education");
    }

    setIsAdding(false);
  };

  const openDeleteDialog = (id: string, type: "work" | "education") => {
    setTimelineToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!timelineToDelete) return;
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/${APP_CONFIG.ROUTE.TIMELINES}?id=${timelineToDelete.id}&type=${timelineToDelete.type}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (data.success) {
        invalidate();
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
    } finally {
      setIsSaving(false);
    }
  };

  const moveUp = async (index: number, type: "work" | "education") => {
    const targetTimelines =
      type === "work" ? workTimelines : educationTimelines;
    if (index === 0) return;
    const reordered = [...targetTimelines];
    [reordered[index], reordered[index - 1]] = [
      reordered[index - 1],
      reordered[index],
    ];
    const updates = reordered.map((timeline, idx) => ({
      id: timeline.id,
      order: idx,
    }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  const moveDown = async (index: number, type: "work" | "education") => {
    const targetTimelines =
      type === "work" ? workTimelines : educationTimelines;
    if (index === targetTimelines.length - 1) return;
    const reordered = [...targetTimelines];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    const updates = reordered.map((timeline, idx) => ({
      id: timeline.id,
      order: idx,
    }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  const workTimelines = timelines.filter((t) => t.type === "work");
  const educationTimelines = timelines.filter((t) => t.type === "education");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            Manage Timeline
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          value={activeTimelineTab}
          onValueChange={(v) => setActiveTimelineTab(v as "work" | "education")}
        >
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger
              value="work"
              className="border border-muted-foreground/20"
            >
              Work Experience
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="border border-muted-foreground/20"
            >
              Education
            </TabsTrigger>
          </TabsList>

          <TabsContent value="work" className="space-y-4 mt-4">
            <Button
              onClick={() => setIsAdding(!isAdding)}
              size="lg"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>

            {(isAdding || editingId) && activeTimelineTab === "work" && (
              <WorkForm
                form={workForm}
                setForm={setWorkForm}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSaving}
                isEditing={!!editingId}
                onAddPosition={addPosition}
                onRemovePosition={removePosition}
                onUpdatePosition={updatePosition}
              />
            )}

            <div className="space-y-3">
              {workTimelines.length === 0 && (isMutating || isSaving) ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-3 sm:p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <>
                  {workTimelines.map((timeline, idx) => (
                    <WorkCard
                      key={timeline.id}
                      timeline={timeline}
                      onEdit={handleEdit}
                      onDelete={openDeleteDialog}
                      onMoveUp={() => moveUp(idx, "work")}
                      onMoveDown={() => moveDown(idx, "work")}
                      isEditing={editingId === timeline.id}
                      isFirst={idx === 0}
                      isLast={idx === workTimelines.length - 1}
                    />
                  ))}
                  {workTimelines.length === 0 && (
                    <EmptyState message="No work experience added yet." />
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-4 mt-4">
            <Button
              onClick={() => setIsAdding(!isAdding)}
              size="lg"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>

            {(isAdding || editingId) && activeTimelineTab === "education" && (
              <EducationForm
                form={educationForm}
                setForm={setEducationForm}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSaving}
                isEditing={!!editingId}
              />
            )}

            <div className="space-y-3">
              {educationTimelines.length === 0 && (isMutating || isSaving) ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-3 sm:p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <>
                  {educationTimelines.map((timeline, idx) => (
                    <EducationCard
                      key={timeline.id}
                      timeline={timeline}
                      onEdit={handleEdit}
                      onDelete={openDeleteDialog}
                      onMoveUp={() => moveUp(idx, "education")}
                      onMoveDown={() => moveDown(idx, "education")}
                      isEditing={editingId === timeline.id}
                      isFirst={idx === 0}
                      isLast={idx === educationTimelines.length - 1}
                    />
                  ))}
                  {educationTimelines.length === 0 && (
                    <EmptyState message="No education added yet." />
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <DeleteConfirmBox
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        isLoading={isSaving}
        handleDelete={handleDelete}
        description="Are you sure you want to delete this timeline entry? This action cannot be undone."
      />
    </Card>
  );
}

function WorkForm({
  form,
  setForm,
  onSave,
  onCancel,
  isLoading,
  isEditing,
  onAddPosition,
  onRemovePosition,
  onUpdatePosition,
}: {
  form: WorkFormData;
  setForm: (data: WorkFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
  onAddPosition: () => void;
  onRemovePosition: (idx: number) => void;
  onUpdatePosition: (
    idx: number,
    field: keyof PositionForm,
    value: string,
  ) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              placeholder="e.g. Tech Company"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Company Logo URL</Label>
            <Input
              value={form.companyLogo}
              onChange={(e) =>
                setForm({ ...form, companyLogo: e.target.value })
              }
              placeholder="https://example.com/logo.png"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Company Website</Label>
            <Input
              value={form.companyWebsite}
              onChange={(e) =>
                setForm({ ...form, companyWebsite: e.target.value })
              }
              placeholder="https://example.com"
              className="h-11"
            />
          </div>
        </div>

        {/* Positions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Positions</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddPosition}
            >
              <Plus className="h-4 w-4" />
              Add Position
            </Button>
          </div>

          {form.positions.map((pos, idx) => (
            <Card key={pos.id} className="border border-muted-foreground/20">
              <CardContent className="px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Position {idx + 1}
                  </Label>
                  {form.positions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePosition(idx)}
                      className="h-7 px-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Title *</Label>
                    <Input
                      value={pos.title}
                      onChange={(e) =>
                        onUpdatePosition(idx, "title", e.target.value)
                      }
                      placeholder="e.g. Full Stack Developer"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Employment Type</Label>
                    <Select
                      value={pos.employmentType}
                      onValueChange={(v) =>
                        onUpdatePosition(idx, "employmentType", v)
                      }
                    >
                      <SelectTrigger className="h-9 w-1/2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Start Date *</Label>
                    <Input
                      value={pos.start}
                      onChange={(e) =>
                        onUpdatePosition(idx, "start", e.target.value)
                      }
                      placeholder="MM.YYYY or YYYY"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>End Date</Label>
                    <Input
                      value={pos.end}
                      onChange={(e) =>
                        onUpdatePosition(idx, "end", e.target.value)
                      }
                      placeholder="MM.YYYY or YYYY (empty = Present)"
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    value={pos.description}
                    onChange={(e) =>
                      onUpdatePosition(idx, "description", e.target.value)
                    }
                    placeholder="Describe your responsibilities..."
                    rows={3}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Skills (comma separated)</Label>
                  <Input
                    value={pos.skills}
                    onChange={(e) =>
                      onUpdatePosition(idx, "skills", e.target.value)
                    }
                    placeholder="React, TypeScript, Node.js"
                    className="h-9"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onSave}
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            size="lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EducationForm({
  form,
  setForm,
  onSave,
  onCancel,
  isLoading,
  isEditing,
}: {
  form: EducationFormData;
  setForm: (data: EducationFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Institution *</Label>
            <Input
              value={form.institution}
              onChange={(e) =>
                setForm({ ...form, institution: e.target.value })
              }
              placeholder="e.g. University of Technology"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={form.location}
              list="edu-countries-list"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Myanmar"
              className="h-11"
            />
            <datalist id="edu-countries-list">
              {countries.map((country) => (
                <option key={country.code} value={country.name} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label>Period</Label>
            <Input
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              placeholder="e.g. 2020 - 2024"
              className="h-11"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            size="lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkCard({
  timeline,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isEditing,
  isFirst,
  isLast,
}: {
  timeline: TimelineType;
  onEdit: (timeline: TimelineType) => void;
  onDelete: (id: string, type: "work" | "education") => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEditing?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  if (timeline.type !== "work") return null;
  const t = timeline as Extract<TimelineType, { type: "work" }>;

  return (
    <Card
      className={`border border-muted-foreground/20 hover:border-muted-foreground ${isEditing ? "border-primary" : ""}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg wrap-break-word">
                {t.companyName}
              </h3>
              {t.companyWebsite && (
                <p className="text-xs text-muted-foreground mt-1 wrap-break-word">
                  {t.companyWebsite}
                </p>
              )}
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
                onClick={() => onEdit(timeline)}
                className="h-9 w-9 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(timeline.id, "work")}
                className="h-9 w-9 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {t.isCurrentEmployer && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
          </div>

          {t.positions && t.positions.length > 0 && (
            <div className="space-y-2 mt-2">
              {t.positions.map((pos) => (
                <div
                  key={pos.id}
                  className="border-l-2 border-border/50 pl-3 py-1"
                >
                  <p className="text-sm font-medium">{pos.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {pos.employmentPeriod?.start}
                    {pos.employmentPeriod?.end
                      ? ` — ${pos.employmentPeriod.end}`
                      : " Present"}
                    {pos.employmentType && ` · ${pos.employmentType}`}
                  </p>
                  {pos.skills && pos.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pos.skills.map((skill, i) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EducationCard({
  timeline,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isEditing,
  isFirst,
  isLast,
}: {
  timeline: TimelineType;
  onEdit: (timeline: TimelineType) => void;
  onDelete: (id: string, type: "work" | "education") => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEditing?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  if (timeline.type !== "education") return null;
  const t = timeline as Extract<TimelineType, { type: "education" }>;

  return (
    <Card
      className={`border border-muted-foreground/20 hover:border-muted-foreground ${isEditing ? "border-primary" : ""}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg capitalize wrap-break-word">
                {t.institution}
              </h3>
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
                onClick={() => onEdit(timeline)}
                className="h-9 w-9 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(timeline.id, "education")}
                className="h-9 w-9 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {t.period && <Badge variant="outline">{t.period}</Badge>}
            {t.location && <Badge variant="outline">{t.location}</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
