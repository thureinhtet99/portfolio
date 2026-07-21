import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PostType } from "@/types/index.type";
import {
  FileText,
  Plus,
  Save,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DeleteConfirmBox from "@/components/shared/delete-confirm-box";

export default function PostsSection() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    tags: "",
    published: false,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (data.success) {
        setPosts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.slug || !formData.title || !formData.body) {
      toast.error("Slug, title, and body are required");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        slug: formData.slug,
        title: formData.title,
        excerpt: formData.excerpt || undefined,
        body: formData.body,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        published: formData.published,
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadPosts();
        resetForm();
        setIsAdding(false);
        toast.success("Post created successfully!");
      } else {
        throw new Error(data.error || "Failed to create post");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to create post";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: PostType) => {
    setEditingId(post.id);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      body: post.body,
      tags: post.tags?.join(", ") || "",
      published: post.published,
    });
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.slug || !formData.title || !formData.body) {
      toast.error("Slug, title, and body are required");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: editingId,
        slug: formData.slug,
        title: formData.title,
        excerpt: formData.excerpt || undefined,
        body: formData.body,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        published: formData.published,
      };

      const response = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadPosts();
        resetForm();
        setEditingId(null);
        toast.success("Post updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update post");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update post";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts?id=${postToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        await loadPosts();
        setDeleteDialogOpen(false);
        setPostToDelete(null);
        toast.success("Post deleted successfully!");
      } else {
        throw new Error(data.error || "Failed to delete post");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete post";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublished = async (post: PostType) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          body: post.body,
          tags: post.tags,
          published: !post.published,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadPosts();
        toast.success(post.published ? "Post unpublished" : "Post published");
      }
    } catch {
      toast.error("Failed to toggle publish state");
    } finally {
      setIsLoading(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...posts];
    [reordered[index], reordered[index - 1]] = [reordered[index - 1], reordered[index]];
    const updates = reordered.map((p, i) => ({ id: p.id, order: i }));

    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: updates }),
      });
      const data = await response.json();
      if (data.success) {
        await loadPosts();
        toast.success("Order updated");
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setIsLoading(false);
    }
  };

  const moveDown = async (index: number) => {
    if (index === posts.length - 1) return;
    const reordered = [...posts];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    const updates = reordered.map((p, i) => ({ id: p.id, order: i }));

    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: updates }),
      });
      const data = await response.json();
      if (data.success) {
        await loadPosts();
        toast.success("Order updated");
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ slug: "", title: "", excerpt: "", body: "", tags: "", published: false });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <Card className="surface-panel">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manage Posts
          </CardTitle>
          <Button size="sm" onClick={() => { setIsAdding(!isAdding); setEditingId(null); resetForm(); }}>
            <Plus className="h-4 w-4" />
            Add Post
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <Card className="surface-panel">
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title,
                        slug: editingId ? prev.slug : generateSlug(title),
                      }));
                    }}
                    placeholder="My First Post"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="my-first-post"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A short summary of the post"
                />
              </div>
              <div className="space-y-2">
                <Label>Body * (Markdown)</Label>
                <Textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Write your post content in Markdown..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="nextjs, react, webdev"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={formData.published ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                  type="button"
                >
                  {formData.published ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                  {formData.published ? "Published" : "Draft"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={editingId ? handleUpdate : handleAdd} className="flex-1" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
                <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {postsLoading ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {posts.map((post, index) => (
                <Card
                  key={post.id}
                  className={`hover:shadow-md transition-shadow ${editingId === post.id ? "border-primary" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base">{post.title}</h3>
                          <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">/{post.slug}</p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => moveUp(index)} disabled={index === 0} className="h-9 w-9 p-0" title="Move up">
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => moveDown(index)} disabled={index === posts.length - 1} className="h-9 w-9 p-0" title="Move down">
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => togglePublished(post)} className="h-9 w-9 p-0" title={post.published ? "Unpublish" : "Publish"}>
                          {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(post)} className="h-9 w-9 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(post.id)} className="h-9 w-9 p-0">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No posts yet. Click &quot;Add Post&quot; to get started.</p>
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
