import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CertificateType } from "@/types/index.type";
import {
  Award,
  Plus,
  Save,
  Edit,
  Trash2,
  ExternalLink,
  Upload,
  X,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { APP_CONFIG } from "@/config/app-config";
import DeleteConfirmBox from "@/components/DeleteConfirmBox";
import Image from "next/image";

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await fetch(`/api/${APP_CONFIG.ROUTE.CERTIFICATES}`);
      const data = await response.json();
      if (data.success) {
        setCertificates(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load certificates:", error);
      toast.error("Failed to load certificates");
    } finally {
      setCertificatesLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.issuer || !formData.issueDate) {
      toast.error("Please fill in all required fields");
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
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
        image: imageUrl || undefined,
      };

      const response = await fetch(`/api/${APP_CONFIG.ROUTE.CERTIFICATES}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadCertificates();
        resetForm();
        setIsAdding(false);
        toast.success("Certificate added successfully!");
      } else {
        throw new Error(data.error || "Failed to add certificate");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add certificate";
      toast.error(errorMessage);
      console.error("Add certificate error:", error);
    } finally {
      setIsLoading(false);
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
    setImagePreview(certificate.image || null);
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (
      !formData.title ||
      !formData.issuer ||
      !formData.issueDate ||
      !editingId
    ) {
      toast.error("Please fill in all required fields");
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
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
        image: imageUrl || undefined,
      };

      const response = await fetch(`/api/${APP_CONFIG.ROUTE.CERTIFICATES}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadCertificates();
        resetForm();
        setEditingId(null);
        toast.success("Certificate updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update certificate");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update certificate";
      toast.error(errorMessage);
      console.error("Update certificate error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setCertificateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!certificateToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/${APP_CONFIG.ROUTE.CERTIFICATES}?id=${certificateToDelete}`,
        { method: "DELETE" }
      );

      const data = await response.json();
      if (data.success) {
        await loadCertificates();
        setDeleteDialogOpen(false);
        setCertificateToDelete(null);
        toast.success("Certificate deleted successfully!");
      } else {
        throw new Error(data.error || "Failed to delete certificate");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete certificate";
      toast.error(errorMessage);
      console.error("Delete certificate error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
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
            <Award className="h-5 w-5" />
            Manage Certificates
          </CardTitle>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <CertificateForm
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
          {certificatesLoading ? (
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
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onEdit={handleEdit}
                  onDelete={openDeleteDialog}
                  isEditing={editingId === certificate.id}
                />
              ))}
              {certificates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>
                    No certificates added yet. Click &quot;Add Certificate&quot;
                    to get started.
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

function CertificateForm({
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
    issuer: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
    image: string;
  };
  setFormData: (data: {
    title: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
    image: string;
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
          <Label>Certificate Image</Label>
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={imagePreview}
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
              placeholder="e.g. AWS Certified Developer"
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
            />
          </div>
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

function CertificateCard({
  certificate,
  onEdit,
  onDelete,
  isEditing,
}: {
  certificate: CertificateType;
  onEdit: (certificate: CertificateType) => void;
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
              <Calendar className="h-3.5 w-3.5" />
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
                <ExternalLink className="h-3.5 w-3.5" />
                View Credential
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
