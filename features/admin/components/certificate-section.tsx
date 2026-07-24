import AdminSectionHeader from "@/components/shared/admin-section-header";
import DeleteConfirmBox from "@/components/shared/delete-confirm-box";
import EmptyState from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_CONFIG } from "@/config/app-config";
import { useCrudResource } from "@/hooks/use-crud";
import { useImageUpload } from "@/hooks/use-image-upload";
import { CertificateType } from "@/types/index.type";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Edit,
  ExternalLink,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function CertificatesSection() {
  const { items: certificates, isMutating, create, update, remove, reorder } =
    useCrudResource<CertificateType>({
      resource: APP_CONFIG.ROUTE.CERTIFICATES,
      labels: { singular: "certificate", plural: "certificates" },
    });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: "",
  });

  const imageUpload = useImageUpload(formData.image || undefined);

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
    });
    imageUpload.reset();
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.issuer || !formData.issueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const imageUrl = await imageUpload.upload();

      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
        image: imageUrl || undefined,
      };

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

  const handleEdit = (certificate: CertificateType) => {
    setEditingId(certificate.id);
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer || "",
      issueDate: certificate.issueDate || "",
      credentialId: certificate.credentialId || "",
      credentialUrl: certificate.credentialUrl || "",
      image: certificate.image || "",
    });
    imageUpload.reset();
    setIsAdding(false);
  };

  const openDeleteDialog = (id: string) => {
    setCertificateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!certificateToDelete) return;
    await remove(certificateToDelete);
    setDeleteDialogOpen(false);
    setCertificateToDelete(null);
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...certificates];
    [reordered[index], reordered[index - 1]] = [
      reordered[index - 1],
      reordered[index],
    ];
    const updates = reordered.map((cert, idx) => ({ id: cert.id, order: idx }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  const moveDown = async (index: number) => {
    if (index === certificates.length - 1) return;
    const reordered = [...certificates];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    const updates = reordered.map((cert, idx) => ({ id: cert.id, order: idx }));
    try {
      await reorder(updates);
    } catch {
      // toast handled by hook
    }
  };

  return (
    <Card>
      <AdminSectionHeader
        title="Manage Certificates"
        count={certificates.length}
        onAdd={() => setIsAdding(!isAdding)}
        addLabel="Add Certificate"
      />
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <CertificateForm
            formData={formData}
            setFormData={setFormData}
            imageUpload={imageUpload}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
            isEditing={!!editingId}
          />
        )}

        <div className="space-y-3">
          {certificates.length === 0 && (isMutating || isSaving) ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {certificates.map((certificate, index) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onEdit={handleEdit}
                  onDelete={openDeleteDialog}
                  onMoveUp={() => moveUp(index)}
                  onMoveDown={() => moveDown(index)}
                  isEditing={editingId === certificate.id}
                  isFirst={index === 0}
                  isLast={index === certificates.length - 1}
                />
              ))}
              {certificates.length === 0 && (
                <EmptyState message="No certificates added yet." />
              )}
            </>
          )}
        </div>
      </CardContent>

      <DeleteConfirmBox
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        isLoading={isMutating || isSaving}
        handleDelete={handleDelete}
        description="Are you sure you want to delete this certificate? This action cannot be undone."
      />
    </Card>
  );
}

function CertificateForm({
  formData,
  setFormData,
  imageUpload,
  onSave,
  onCancel,
  isLoading,
  isEditing,
}: {
  formData: {
    title: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
    image: string;
  };
  setFormData: (data: typeof formData) => void;
  imageUpload: ReturnType<typeof useImageUpload>;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
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
          <Label>Certificate Image</Label>
          {preview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Certificate preview"
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
            <Label htmlFor="certificate-image" className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 hover:border-primary/50 transition-all">
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Click to upload certificate image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
              <Input
                id="certificate-image"
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
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. AWS Certified Developer"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Issue by *</Label>
            <Input
              value={formData.issuer}
              onChange={(e) =>
                setFormData({ ...formData, issuer: e.target.value })
              }
              placeholder="e.g. Amazon Web Services"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Issue Date *</Label>
            <Input
              type="date"
              value={formData.issueDate}
              onChange={(e) =>
                setFormData({ ...formData, issueDate: e.target.value })
              }
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Credential ID</Label>
            <Input
              value={formData.credentialId}
              onChange={(e) =>
                setFormData({ ...formData, credentialId: e.target.value })
              }
              placeholder="e.g. ABC123XYZ"
              className="h-11"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Credential URL</Label>
            <Input
              value={formData.credentialUrl}
              onChange={(e) =>
                setFormData({ ...formData, credentialUrl: e.target.value })
              }
              placeholder="https://..."
              className="h-11"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            className="flex-1"
            size="lg"
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

function CertificateCard({
  certificate,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isEditing,
  isFirst,
  isLast,
}: {
  certificate: CertificateType;
  onEdit: (certificate: CertificateType) => void;
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
          {/* Certificate Image */}
          {certificate.image && (
            <div className="w-full h-48 relative rounded-md overflow-hidden bg-muted">
              <Image
                src={certificate.image}
                alt={certificate.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg capitalize break-words">
                {certificate.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {certificate.issuer}
              </p>
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
                onClick={() => onEdit(certificate)}
                className="h-9 w-9 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(certificate.id)}
                className="h-9 w-9 p-0"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          {/* Issue Date */}
          {certificate.issueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(certificate.issueDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Credential Info */}
          <div className="flex flex-wrap gap-2">
            {certificate.credentialId && (
              <Badge variant="outline" className="text-xs">
                ID: {certificate.credentialId}
              </Badge>
            )}
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View Credential
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
