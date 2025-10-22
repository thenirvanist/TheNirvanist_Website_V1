import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit3, Save, X, Upload, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const categories = [
  "Mindful Eating", 
  "Spiritual Nutrition", 
  "Ayurvedic Cooking", 
  "Meditation & Food", 
  "Sacred Recipes", 
  "Fasting Wisdom"
];

export default function NutritionAdmin() {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploadingImage, setUploadingImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all blog posts
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id'>) => {
      return apiRequest("POST", "/api/blog", post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setShowCreateForm(false);
      setEditingPost(null);
      toast({ title: "Article created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create article", variant: "destructive" });
    },
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (post: Partial<BlogPost> & { id: number }) => {
      return apiRequest("PUT", `/api/blog/${post.id}`, post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setEditingPost(null);
      toast({ title: "Article updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update article", variant: "destructive" });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Article deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete article", variant: "destructive" });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!uploadingImage) return;

    const formData = new FormData();
    formData.append("image", uploadingImage);
    formData.append("category", "blog");
    
    try {
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (editingPost) {
          setEditingPost({
            ...editingPost,
            imageUrl: data.imageUrl,
          });
        }
        setUploadingImage(null);
        setImagePreview(null);
        toast({ title: "Image uploaded successfully!" });
      }
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  };

  const handleSavePost = () => {
    if (!editingPost) return;
    
    // Generate slug from title if not set
    if (!editingPost.slug) {
      editingPost.slug = generateSlug(editingPost.title);
    }
    
    updatePostMutation.mutate(editingPost);
  };

  const handleCreatePost = () => {
    if (!editingPost) return;
    
    // Generate slug from title
    editingPost.slug = generateSlug(editingPost.title);
    
    createPostMutation.mutate(editingPost);
  };

  const handleDeletePost = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deletePostMutation.mutate(id);
    }
  };

  const startNewPost = () => {
    setEditingPost({
      id: 0,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      category: categories[0],
      tags: [],
    });
    setShowCreateForm(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inner Nutrition Articles</h1>
          <p className="text-gray-600">Create and manage spiritual nutrition content</p>
        </div>
        <Button onClick={startNewPost} data-testid="button-add-article">
          <Plus className="w-4 h-4 mr-2" />
          Add New Article
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[16/10] bg-gray-200 relative">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                data-testid={`img-post-${post.id}`}
              />
              <div className="absolute top-2 right-2 space-x-2">
                <Button
                  onClick={() => setEditingPost(post)}
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid={`button-edit-${post.id}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs">
                {post.category}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" data-testid={`text-title-${post.id}`}>
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2">/{post.slug}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setEditingPost(post)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeletePost(post.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  data-testid={`button-delete-${post.id}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {showCreateForm ? "Create New Article" : "Edit Article"}
                </h2>
                <Button
                  onClick={() => {
                    setEditingPost(null);
                    setShowCreateForm(false);
                  }}
                  variant="ghost"
                  size="sm"
                  data-testid="button-close-edit"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <Input
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value, slug: generateSlug(e.target.value) })}
                      data-testid="input-title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                    <Input
                      value={editingPost.slug}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                      data-testid="input-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select
                      value={editingPost.category}
                      onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <Textarea
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      rows={3}
                      data-testid="input-excerpt"
                    />
                  </div>

                  {/* Image Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                    {editingPost.imageUrl && (
                      <div className="aspect-[16/10] w-full bg-gray-200 rounded-lg overflow-hidden mb-4">
                        <img
                          src={editingPost.imageUrl}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        data-testid="input-image-upload"
                      />
                      {imagePreview && (
                        <div className="aspect-[16/10] w-full bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {uploadingImage && (
                        <Button onClick={handleImageUpload} size="sm" data-testid="button-upload-image">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Article Content</label>
                  <Textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={20}
                    className="font-mono text-sm"
                    placeholder="Write your article content here... You can use markdown formatting."
                    data-testid="input-content"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={showCreateForm ? handleCreatePost : handleSavePost}
                  disabled={updatePostMutation.isPending || createPostMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-post"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showCreateForm ? "Create Article" : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setEditingPost(null);
                    setShowCreateForm(false);
                  }}
                  variant="outline"
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}