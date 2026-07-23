import CustomLoading from "@/components/shared/custom-loading";
import DeleteConfirmBox from "@/components/shared/delete-confirm-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PostType } from "@/types/index.type";
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
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
      const msg =
        error instanceof Error ? error.message : "Failed to create post";
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
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
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
      const msg =
        error instanceof Error ? error.message : "Failed to update post";
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
      const msg =
        error instanceof Error ? error.message : "Failed to delete post";
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
    [reordered[index], reordered[index - 1]] = [
      reordered[index - 1],
      reordered[index],
    ];
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
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
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
    setFormData({
      slug: "",
      title: "",
      excerpt: "",
      body: "",
      tags: "",
      published: false,
    });
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
    <Card>
      <CardHeader>
        <div className="flex justify-end items-center">
          <Button
            size="lg"
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
              resetForm();
            }}
          >
            <Plus className="h-4 w-4" />
            Add Post
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <Card>
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
                    placeholder="my-first-post"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="A short summary of the post"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Body *</Label>
                <p className="text-xs text-muted-foreground">
                  Supports Markdown formatting (e.g., **bold**, *italic*,
                  [links]())
                </p>
                <Textarea
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  placeholder="Write your post content in Markdown..."
                  className="min-h-[200px] text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="nextjs, react, webdev"
                  className="h-11"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  variant={formData.published ? "default" : "outline"}
                  onClick={() =>
                    setFormData({ ...formData, published: !formData.published })
                  }
                  type="button"
                >
                  {formData.published ? (
                    <Eye className="h-4 w-4 mr-1" />
                  ) : (
                    <EyeOff className="h-4 w-4 mr-1" />
                  )}
                  {formData.published ? "Published" : "Draft"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="flex-1"
                  size="lg"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="lg"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {postsLoading ? (
            <CustomLoading />
          ) : (
            <>
              {posts.map((post, index) => (
                <Card
                  key={post.id}
                  className={`border border-muted-foreground/20 hover:border-muted-foreground transition-shadow ${editingId === post.id ? "border-primary" : ""}`}
                >
                  <CardContent className="px-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-semibold text-base">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          #{post.slug}
                        </p>
                        <Badge variant={post.published ? "default" : "outline"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs border-muted-foreground/20"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="h-9 w-9 p-0"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveDown(index)}
                          disabled={index === posts.length - 1}
                          className="h-9 w-9 p-0"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePublished(post)}
                          className="h-9 w-9 p-0"
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(post)}
                          className="h-9 w-9 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteDialog(post.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No posts added yet.</p>
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
