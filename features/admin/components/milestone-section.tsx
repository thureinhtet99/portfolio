import AdminSectionHeader from "@/components/shared/admin-section-header";
import CustomLoading from "@/components/shared/custom-loading";
import DeleteConfirmBox from "@/components/shared/delete-confirm-box";
import EmptyState from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/config/app-config";
import { useCrudResource } from "@/hooks/use-crud";
import { MilestoneType } from "@/types/index.type";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Edit,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MilestonesSection() {
  const {
    items: milestones,
    isMutating,
    create,
    update,
    remove,
    reorder,
  } = useCrudResource<MilestoneType>({
    resource: APP_CONFIG.ROUTE.MILESTONES,
    labels: { singular: "milestone", plural: "milestones" },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({ title: "", date: "", description: "" });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        date: formData.date,
        description: formData.description || undefined,
      };

      if (editingId) {
        await update({ id: editingId, ...payload });
        setEditingId(null);
      } else {
        await create(payload);
        setIsAdding(false);
      }
      resetForm();
    } catch {
      // toast handled by hook
    }
  };

  const handleEdit = (milestone: MilestoneType) => {
    setEditingId(milestone.id);
    setFormData({
      title: milestone.title,
      date: milestone.date,
      description: milestone.description || "",
    });
    setIsAdding(false);
  };

  const openDeleteDialog = (id: string) => {
    setMilestoneToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!milestoneToDelete) return;
    await remove(milestoneToDelete);
    setDeleteDialogOpen(false);
    setMilestoneToDelete(null);
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...milestones];
    [reordered[index], reordered[index - 1]] = [
      reordered[index - 1],
      reordered[index],
    ];
    const updates = reordered.map((m, idx) => ({ id: m.id, order: idx }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  const moveDown = async (index: number) => {
    if (index === milestones.length - 1) return;
    const reordered = [...milestones];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    const updates = reordered.map((m, idx) => ({ id: m.id, order: idx }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  return (
    <Card>
      <AdminSectionHeader
        title="Milestones"
        count={milestones.length}
        onAdd={() => setIsAdding(!isAdding)}
        addLabel="Add Milestone"
      />
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <MilestoneForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isMutating}
            isEditing={!!editingId}
          />
        )}

        <div className="space-y-3">
          {milestones.length === 0 && isMutating ? (
            <CustomLoading />
          ) : (
            <>
              {milestones.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onEdit={handleEdit}
                  onDelete={openDeleteDialog}
                  onMoveUp={() => moveUp(index)}
                  onMoveDown={() => moveDown(index)}
                  isEditing={editingId === milestone.id}
                  isFirst={index === 0}
                  isLast={index === milestones.length - 1}
                />
              ))}
              {milestones.length === 0 && (
                <EmptyState message="No milestones added yet." />
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
        description="Are you sure you want to delete this milestone? This action cannot be undone."
      />
    </Card>
  );
}

function MilestoneForm({
  formData,
  setFormData,
  onSave,
  onCancel,
  isLoading,
  isEditing,
}: {
  formData: { title: string; date: string; description: string };
  setFormData: (data: typeof formData) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Won 1st Prize"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Year *</Label>
            <Input
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              placeholder="e.g. 2024"
              className="h-11"
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
            placeholder="Optional description (supports markdown)"
            rows={3}
          />
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

function MilestoneCard({
  milestone,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isEditing,
  isFirst,
  isLast,
}: {
  milestone: MilestoneType;
  onEdit: (milestone: MilestoneType) => void;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEditing?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <Card
      className={`border border-muted-foreground/20 hover:border-muted-foreground ${isEditing ? "border-primary" : ""}`}
    >
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg">
              {milestone.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {milestone.date}
              </Badge>
            </div>
            {milestone.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {milestone.description}
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
              title="Move up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onMoveDown}
              disabled={isLast}
              className="h-9 w-9 p-0"
              title="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(milestone)}
              className="h-9 w-9 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(milestone.id)}
              className="h-9 w-9 p-0"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
