"use client";

import AdminSectionHeader from "@/components/shared/admin-section-header";
import CustomLoading from "@/components/shared/custom-loading";
import DeleteConfirmBox from "@/components/shared/delete-confirm-box";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/config/app-config";
import { useCrudResource } from "@/hooks/use-crud";
import { TimelineType } from "@/types/index.type";
import { ArrowDown, ArrowUp, Edit, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TimelineFormData = {
  year: string;
  title: string;
  description?: string | null;
};

const emptyForm = (): TimelineFormData => ({
  year: "",
  title: "",
  description: "",
});

export default function TimelinesSection() {
  const {
    items: timelines,
    isMutating,
    create,
    update,
    remove,
    reorder,
  } = useCrudResource<TimelineType>({
    resource: APP_CONFIG.ROUTE.TIMELINES,
    labels: { singular: "timeline", plural: "timelines" },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [form, setForm] = useState<TimelineFormData>(emptyForm());

  const handleCancel = () => {
    setForm(emptyForm());
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.year.trim()) {
      toast.error("Year is required");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const payload = {
        year: form.year.trim(),
        title: form.title.trim(),
        description: form.description?.trim(),
      };

      if (editingId) {
        await update({ id: editingId, ...payload });
        setEditingId(null);
      } else {
        await create(payload);
        setIsAdding(false);
      }
      setForm(emptyForm());
    } catch {
      // toast handled by hook
    }
  };

  const handleEdit = (item: TimelineType) => {
    setEditingId(item.id);
    setForm({
      year: item.year,
      title: item.title,
      description: item.description ?? null,
    });
    setIsAdding(false);
  };

  const openDeleteDialog = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await remove(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      // toast handled by hook
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...timelines];
    [reordered[index], reordered[index - 1]] = [
      reordered[index - 1],
      reordered[index],
    ];
    await reorder(reordered.map((t, idx) => ({ id: t.id, order: idx })));
  };

  const moveDown = async (index: number) => {
    if (index === timelines.length - 1) return;
    const reordered = [...timelines];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    await reorder(reordered.map((t, idx) => ({ id: t.id, order: idx })));
  };

  return (
    <Card>
      <AdminSectionHeader
        title="Timelines"
        count={timelines.length}
        onAdd={() => {
          setIsAdding(!isAdding);
          setEditingId(null);
          setForm(emptyForm());
        }}
        addLabel="Add Timeline Item"
      />

      <CardContent className="space-y-4">
        {/* Form */}
        {(isAdding || editingId) && (
          <TimelineForm
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isMutating}
            isEditing={!!editingId}
          />
        )}

        {/* List */}
        <div className="space-y-3">
          {timelines.length === 0 && isMutating ? (
            <CustomLoading />
          ) : (
            <>
              {timelines.map((item, idx) => (
                <TimelineCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={openDeleteDialog}
                  onMoveUp={() => moveUp(idx)}
                  onMoveDown={() => moveDown(idx)}
                  isEditing={editingId === item.id}
                  isFirst={idx === 0}
                  isLast={idx === timelines.length - 1}
                />
              ))}
              {timelines.length === 0 && (
                <EmptyState message="No timeline items yet." />
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
        description="Are you sure you want to delete this timeline item? This action cannot be undone."
      />
    </Card>
  );
}

function TimelineForm({
  form,
  setForm,
  onSave,
  onCancel,
  isLoading,
  isEditing,
}: {
  form: TimelineFormData;
  setForm: (data: TimelineFormData) => void;
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
            <Label>Year *</Label>
            <Input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="e.g. 2024"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Started at Company X"
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <p className="text-xs text-muted-foreground">
            Supports Markdown formatting (e.g., **bold**, *italic*, [links](),
            lists)
          </p>
          <Textarea
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe this timeline..."
            rows={4}
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

function TimelineCard({
  item,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isEditing,
  isFirst,
  isLast,
}: {
  item: TimelineType;
  onEdit: (item: TimelineType) => void;
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
            <span className="text-xs font-mono font-semibold text-muted-foreground tabular-nums">
              {item.year}
            </span>
            <h3 className="font-semibold text-sm sm:text-base truncate">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {item.description}
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
              onClick={() => onEdit(item)}
              className="h-9 w-9 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
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
