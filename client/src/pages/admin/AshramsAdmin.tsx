import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit3, Save, X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Ashram } from "@shared/schema";

const regions = ["North India", "South India", "West India", "East India", "Central India"];
const focuses = [
  "Meditation", 
  "Yoga", 
  "Vedanta", 
  "Bhakti", 
  "Karma Yoga", 
  "Self-Realization", 
  "Community Service", 
  "Healing Arts"
];

// Helper to convert arrays to comma-separated strings for editing
const arrayToString = (arr: string[] | null | undefined): string => {
  if (!arr || arr.length === 0) return "";
  return arr.join(", ");
};

// Helper to convert comma-separated strings to arrays
const stringToArray = (str: string): string[] | null => {
  if (!str || str.trim() === "") return null;
  return str.split(",").map(s => s.trim()).filter(s => s.length > 0);
};

export default function AshramsAdmin() {
  const [editingAshram, setEditingAshram] = useState<Ashram | null>(null);
  const [uploadingImage, setUploadingImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all ashrams
  const { data: ashrams = [], isLoading } = useQuery<Ashram[]>({
    queryKey: ["/api/ashrams"],
  });

  // Create ashram mutation
  const createAshramMutation = useMutation({
    mutationFn: async (ashram: Omit<Ashram, 'id'>) => {
      return apiRequest("POST", "/api/ashrams", ashram);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ashrams"] });
      setShowCreateForm(false);
      setEditingAshram(null);
      toast({ title: "Ashram created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create ashram", variant: "destructive" });
    },
  });

  // Update ashram mutation
  const updateAshramMutation = useMutation({
    mutationFn: async (ashram: Partial<Ashram> & { id: number }) => {
      return apiRequest("PUT", `/api/ashrams/${ashram.id}`, ashram);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ashrams"] });
      setEditingAshram(null);
      toast({ title: "Ashram updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update ashram", variant: "destructive" });
    },
  });

  // Delete ashram mutation
  const deleteAshramMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/ashrams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ashrams"] });
      toast({ title: "Ashram deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete ashram", variant: "destructive" });
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
    formData.append("category", "ashram");
    
    try {
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (editingAshram) {
          setEditingAshram({
            ...editingAshram,
            image: data.imageUrl, // Server returns imageUrl, we store as image
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

  const handleSaveAshram = () => {
    if (!editingAshram) return;
    updateAshramMutation.mutate(editingAshram);
  };

  const handleCreateAshram = () => {
    if (!editingAshram) return;
    createAshramMutation.mutate(editingAshram);
  };

  const handleDeleteAshram = (id: number) => {
    if (confirm("Are you sure you want to delete this ashram?")) {
      deleteAshramMutation.mutate(id);
    }
  };

  const startNewAshram = () => {
    setEditingAshram({
      id: 0,
      name: "",
      location: "",
      description: "",
      image: "",
      facilities: null,
      contact: null,
      website: null,
      region: regions[0],
      focus: focuses[0],
      founders: null,
    });
    setShowCreateForm(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading ashrams...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sacred Ashrams Management</h1>
          <p className="text-gray-600">Upload and manage ashram content</p>
        </div>
        <Button onClick={startNewAshram} data-testid="button-add-ashram">
          <Plus className="w-4 h-4 mr-2" />
          Add New Ashram
        </Button>
      </div>

      {/* Ashrams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ashrams.map((ashram) => (
          <div key={ashram.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 relative">
              <img
                src={ashram.image}
                alt={ashram.name}
                className="w-full h-full object-cover"
                data-testid={`img-ashram-${ashram.id}`}
              />
              <div className="absolute top-2 right-2 space-x-2">
                <Button
                  onClick={() => setEditingAshram(ashram)}
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid={`button-edit-${ashram.id}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs">
                {ashram.region}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1" data-testid={`text-name-${ashram.id}`}>
                {ashram.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{ashram.location}</p>
              <p className="text-sm text-orange-600 mb-2">{ashram.focus}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {ashram.description}
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setEditingAshram(ashram)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteAshram(ashram.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  data-testid={`button-delete-${ashram.id}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingAshram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[95vh] overflow-y-auto my-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {showCreateForm ? "Create New Ashram" : "Edit Ashram"}
                </h2>
                <Button
                  onClick={() => {
                    setEditingAshram(null);
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
                  Ashram Image
                </label>
                {editingAshram.image && (
                  <div className="aspect-[4/3] w-full bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img
                      src={editingAshram.image}
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
                    <div className="aspect-[4/3] w-full bg-gray-200 rounded-lg overflow-hidden">
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
                <p className="text-xs text-gray-500 mt-2">
                  Or paste image URL directly below:
                </p>
                <Input
                  value={editingAshram.image}
                  onChange={(e) => setEditingAshram({ ...editingAshram, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2"
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <Input
                    value={editingAshram.name}
                    onChange={(e) => setEditingAshram({ ...editingAshram, name: e.target.value })}
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <Input
                    value={editingAshram.location}
                    onChange={(e) => setEditingAshram({ ...editingAshram, location: e.target.value })}
                    data-testid="input-location"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <Select
                      value={editingAshram.region || ""}
                      onValueChange={(value) => setEditingAshram({ ...editingAshram, region: value })}
                    >
                      <SelectTrigger data-testid="select-region">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Focus</label>
                    <Select
                      value={editingAshram.focus || ""}
                      onValueChange={(value) => setEditingAshram({ ...editingAshram, focus: value })}
                    >
                      <SelectTrigger data-testid="select-focus">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {focuses.map((focus) => (
                          <SelectItem key={focus} value={focus}>
                            {focus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founders</label>
                  <Input
                    value={editingAshram.founders || ""}
                    onChange={(e) => setEditingAshram({ ...editingAshram, founders: e.target.value })}
                    placeholder="Names of founders or spiritual leaders"
                    data-testid="input-founders"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <Textarea
                    value={editingAshram.description}
                    onChange={(e) => setEditingAshram({ ...editingAshram, description: e.target.value })}
                    rows={4}
                    data-testid="input-description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facilities (comma-separated)
                  </label>
                  <Textarea
                    value={arrayToString(editingAshram.facilities)}
                    onChange={(e) => setEditingAshram({ ...editingAshram, facilities: stringToArray(e.target.value) })}
                    rows={2}
                    placeholder="Meditation Hall, Guest Rooms, Library, Garden"
                    data-testid="input-facilities"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <Input
                      value={editingAshram.contact || ""}
                      onChange={(e) => setEditingAshram({ ...editingAshram, contact: e.target.value })}
                      placeholder="Email or phone"
                      data-testid="input-contact"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <Input
                      value={editingAshram.website || ""}
                      onChange={(e) => setEditingAshram({ ...editingAshram, website: e.target.value })}
                      type="url"
                      placeholder="https://example.com"
                      data-testid="input-website"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={showCreateForm ? handleCreateAshram : handleSaveAshram}
                  disabled={updateAshramMutation.isPending || createAshramMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-ashram"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showCreateForm ? "Create Ashram" : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setEditingAshram(null);
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
