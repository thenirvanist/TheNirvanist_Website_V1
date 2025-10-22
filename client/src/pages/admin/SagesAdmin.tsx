import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit3, Eye, EyeOff, Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Sage {
  id: number;
  name: string;
  description: string;
  teachings: string;
  books: string;
  imageUrl: string;
  location?: string;
  category: string;
  era: string;
  status: string;
}

const categories = ["Hindu", "Buddhist", "Sufi", "Jain", "Universal"];
const eras = ["Ancient", "Classical", "Medieval", "Modern", "Contemporary"];
const statuses = ["Living", "Deceased"];

export default function SagesAdmin() {
  const [editingSage, setEditingSage] = useState<Sage | null>(null);
  const [uploadingImage, setUploadingImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all sages
  const { data: sages = [], isLoading } = useQuery<Sage[]>({
    queryKey: ["/api/sages"],
  });

  // Create sage mutation
  const createSageMutation = useMutation({
    mutationFn: async (sage: Omit<Sage, 'id'>) => {
      return apiRequest("POST", "/api/sages", sage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sages"] });
      setShowCreateForm(false);
      toast({ title: "Sage created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create sage", variant: "destructive" });
    },
  });

  // Update sage mutation
  const updateSageMutation = useMutation({
    mutationFn: async (sage: Partial<Sage> & { id: number }) => {
      return apiRequest("PUT", `/api/sages/${sage.id}`, sage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sages"] });
      setEditingSage(null);
      toast({ title: "Sage updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update sage", variant: "destructive" });
    },
  });

  // Delete sage mutation
  const deleteSageMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/sages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sages"] });
      toast({ title: "Sage deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete sage", variant: "destructive" });
    },
  });

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
    formData.append("category", "sage");
    
    try {
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (editingSage) {
          setEditingSage({
            ...editingSage,
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

  const handleSaveSage = () => {
    if (!editingSage) return;
    updateSageMutation.mutate(editingSage);
  };

  const handleCreateSage = () => {
    if (!editingSage) return;
    createSageMutation.mutate(editingSage);
  };

  const handleDeleteSage = (id: number) => {
    if (confirm("Are you sure you want to delete this sage?")) {
      deleteSageMutation.mutate(id);
    }
  };

  const startNewSage = () => {
    setEditingSage({
      id: 0,
      name: "",
      description: "",
      teachings: "",
      books: "",
      imageUrl: "",
      location: "",
      category: "Hindu",
      era: "Modern",
      status: "Living",
    });
    setShowCreateForm(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading sages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sages Management</h1>
          <p className="text-gray-600">Upload and manage sage biographies</p>
        </div>
        <Button onClick={startNewSage} data-testid="button-add-sage">
          <Plus className="w-4 h-4 mr-2" />
          Add New Sage
        </Button>
      </div>

      {/* Sages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sages.map((sage) => (
          <div key={sage.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 relative">
              <img
                src={sage.imageUrl}
                alt={sage.name}
                className="w-full h-full object-cover"
                data-testid={`img-sage-${sage.id}`}
              />
              <div className="absolute top-2 right-2 space-x-2">
                <Button
                  onClick={() => setEditingSage(sage)}
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid={`button-edit-${sage.id}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs">
                {sage.category} • {sage.era}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1" data-testid={`text-name-${sage.id}`}>
                {sage.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{sage.location}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {sage.description}
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setEditingSage(sage)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteSage(sage.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  data-testid={`button-delete-${sage.id}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingSage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {showCreateForm ? "Create New Sage" : "Edit Sage"}
                </h2>
                <Button
                  onClick={() => {
                    setEditingSage(null);
                    setShowCreateForm(false);
                  }}
                  variant="ghost"
                  size="sm"
                  data-testid="button-close-edit"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sage Image
                </label>
                {editingSage.imageUrl && (
                  <div className="aspect-[4/3] w-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img
                      src={editingSage.imageUrl}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    data-testid="input-image-upload"
                  />
                  {imagePreview && (
                    <div className="aspect-[4/3] w-48 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <Button onClick={handleImageUpload} data-testid="button-upload-image">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={editingSage.name}
                    onChange={(e) => setEditingSage({ ...editingSage, name: e.target.value })}
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    value={editingSage.location || ""}
                    onChange={(e) => setEditingSage({ ...editingSage, location: e.target.value })}
                    data-testid="input-location"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select
                      value={editingSage.category}
                      onValueChange={(value) => setEditingSage({ ...editingSage, category: value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Era</label>
                    <Select
                      value={editingSage.era}
                      onValueChange={(value) => setEditingSage({ ...editingSage, era: value })}
                    >
                      <SelectTrigger data-testid="select-era">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eras.map((era) => (
                          <SelectItem key={era} value={era}>
                            {era}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Select
                      value={editingSage.status}
                      onValueChange={(value) => setEditingSage({ ...editingSage, status: value })}
                    >
                      <SelectTrigger data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Textarea
                    value={editingSage.description}
                    onChange={(e) => setEditingSage({ ...editingSage, description: e.target.value })}
                    rows={4}
                    data-testid="input-description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Core Teachings</label>
                  <Textarea
                    value={editingSage.teachings}
                    onChange={(e) => setEditingSage({ ...editingSage, teachings: e.target.value })}
                    rows={3}
                    data-testid="input-teachings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notable Books</label>
                  <Textarea
                    value={editingSage.books}
                    onChange={(e) => setEditingSage({ ...editingSage, books: e.target.value })}
                    rows={2}
                    data-testid="input-books"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={showCreateForm ? handleCreateSage : handleSaveSage}
                  disabled={updateSageMutation.isPending || createSageMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-sage"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showCreateForm ? "Create Sage" : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setEditingSage(null);
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