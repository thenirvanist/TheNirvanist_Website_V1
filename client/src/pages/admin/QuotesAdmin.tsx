import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Edit3, Save, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Quote {
  id: number;
  title: string;
  author: string;
  quoteText?: string;
  imageUrl: string;
  displayDate: string;
  active?: boolean;
}

export default function QuotesAdmin() {
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all quotes
  const { data: quotes = [], isLoading } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
  });

  // Create quote mutation
  const createQuoteMutation = useMutation({
    mutationFn: async (quote: Omit<Quote, 'id'>) => {
      return apiRequest("POST", "/api/quotes", quote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes/active"] });
      setShowCreateForm(false);
      setEditingQuote(null);
      toast({ title: "Quote created successfully!" });
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast({ title: "Failed to create quote", variant: "destructive" });
    },
  });

  // Update quote mutation
  const updateQuoteMutation = useMutation({
    mutationFn: async (quote: Partial<Quote> & { id: number }) => {
      return apiRequest("PUT", `/api/quotes/${quote.id}`, quote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes/active"] });
      setEditingQuote(null);
      toast({ title: "Quote updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update quote", variant: "destructive" });
    },
  });

  // Delete quote mutation
  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/quotes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes/active"] });
      toast({ title: "Quote deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete quote", variant: "destructive" });
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate image dimensions (should be 1080x1080)
      const img = new Image();
      img.onload = () => {
        if (img.width !== 1080 || img.height !== 1080) {
          toast({
            title: "Invalid image dimensions",
            description: "Please upload a 1080x1080 PNG image",
            variant: "destructive",
          });
          return;
        }
        setUploadingImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!uploadingImage || !editingQuote) return;

    const formData = new FormData();
    formData.append("image", uploadingImage);
    formData.append("author", editingQuote.author);
    formData.append("category", "quote");
    
    try {
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setEditingQuote({
          ...editingQuote,
          imageUrl: data.imageUrl,
        });
        setUploadingImage(null);
        setImagePreview(null);
        toast({ title: "Image uploaded successfully!" });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  };

  const handleSaveQuote = () => {
    if (!editingQuote) return;
    
    if (showCreateForm) {
      createQuoteMutation.mutate(editingQuote);
    } else {
      updateQuoteMutation.mutate(editingQuote);
    }
  };

  const handleDeleteQuote = (id: number) => {
    if (confirm("Are you sure you want to delete this quote?")) {
      deleteQuoteMutation.mutate(id);
    }
  };

  const startNewQuote = () => {
    const today = new Date().toISOString().split('T')[0];
    setEditingQuote({
      id: 0,
      title: "",
      author: "",
      quoteText: "",
      imageUrl: "",
      displayDate: today,
      active: true,
    });
    setShowCreateForm(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading quotes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes Management</h1>
          <p className="text-gray-600">Upload and schedule spiritual quotes (1080x1080 PNG images)</p>
        </div>
        <Button onClick={startNewQuote} data-testid="button-add-quote">
          <Plus className="w-4 h-4 mr-2" />
          Add New Quote
        </Button>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image */}
            <div className="aspect-square bg-gray-200 relative">
              <img
                src={quote.imageUrl}
                alt={`Quote by ${quote.author}`}
                className="w-full h-full object-cover"
                data-testid={`img-quote-${quote.id}`}
              />
              <div className="absolute top-2 right-2">
                <Button
                  onClick={() => setEditingQuote(quote)}
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid={`button-edit-${quote.id}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              {quote.active && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white rounded text-xs font-medium">
                  Active
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium">
                {new Date(quote.displayDate).toLocaleDateString()}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1" data-testid={`text-author-${quote.id}`}>
                {quote.author}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2" data-testid={`text-title-${quote.id}`}>
                {quote.title}
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setEditingQuote(quote)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteQuote(quote.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  data-testid={`button-delete-${quote.id}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {showCreateForm ? "Create New Quote" : "Edit Quote"}
                </h2>
                <Button
                  onClick={() => {
                    setEditingQuote(null);
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
                  Quote Image (1080x1080 PNG)
                </label>
                {editingQuote.imageUrl && (
                  <div className="aspect-square w-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img
                      src={editingQuote.imageUrl}
                      alt="Current quote"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImageSelect}
                    data-testid="input-image-upload"
                  />
                  {imagePreview && (
                    <div className="aspect-square w-48 bg-gray-200 rounded-lg overflow-hidden">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name
                  </label>
                  <Input
                    value={editingQuote.author}
                    onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })}
                    placeholder="e.g., Francis of Assisi"
                    data-testid="input-author"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title / Short Description
                  </label>
                  <Input
                    value={editingQuote.title}
                    onChange={(e) => setEditingQuote({ ...editingQuote, title: e.target.value })}
                    placeholder="e.g., On Inner Peace"
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quote Text (Optional)
                  </label>
                  <Textarea
                    value={editingQuote.quoteText || ""}
                    onChange={(e) => setEditingQuote({ ...editingQuote, quoteText: e.target.value })}
                    rows={3}
                    placeholder="Enter the full quote text here..."
                    data-testid="input-quote-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Date
                  </label>
                  <Input
                    type="date"
                    value={editingQuote.displayDate}
                    onChange={(e) => setEditingQuote({ ...editingQuote, displayDate: e.target.value })}
                    data-testid="input-display-date"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The quote will be displayed on this date
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={editingQuote.active || false}
                    onChange={(e) => setEditingQuote({ ...editingQuote, active: e.target.checked })}
                    data-testid="checkbox-active"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Active (visible on homepage)
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleSaveQuote}
                  disabled={createQuoteMutation.isPending || updateQuoteMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-quote"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showCreateForm ? "Create Quote" : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setEditingQuote(null);
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
