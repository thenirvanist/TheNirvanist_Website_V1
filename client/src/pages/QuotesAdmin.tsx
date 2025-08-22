import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Edit3, Eye, EyeOff, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";

interface Quote {
  id: number;
  dayOfWeek: number;
  title: string;
  author: string;
  quoteText?: string;
  imageUrl: string;
  active?: boolean;
  weekStartDate: string;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function QuotesAdmin() {
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [uploadingImage, setUploadingImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all quotes
  const { data: quotes = [], isLoading } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
  });

  // Update quote mutation
  const updateQuoteMutation = useMutation({
    mutationFn: async (quote: Partial<Quote> & { id: number }) => {
      return apiRequest(`/api/quotes/${quote.id}`, {
        method: "PUT",
        body: quote,
      });
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

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/admin/upload-quote-image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: (data) => {
      if (editingQuote) {
        setEditingQuote({
          ...editingQuote,
          imageUrl: data.imageUrl,
        });
      }
      setUploadingImage(null);
      setImagePreview(null);
      toast({ title: "Image uploaded successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to upload image", variant: "destructive" });
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

  const handleImageUpload = () => {
    if (!uploadingImage) return;

    const formData = new FormData();
    formData.append("image", uploadingImage);
    formData.append("author", editingQuote?.author || "");
    
    uploadImageMutation.mutate(formData);
  };

  const handleSaveQuote = () => {
    if (!editingQuote) return;
    updateQuoteMutation.mutate(editingQuote);
  };

  const toggleQuoteActive = (quote: Quote) => {
    updateQuoteMutation.mutate({
      id: quote.id,
      active: !quote.active,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">Loading quotes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Quotes Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage your weekly spiritual quotes - upload images, edit content, and toggle visibility.
          </p>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    onClick={() => toggleQuoteActive(quote)}
                    variant={quote.active ? "default" : "secondary"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    data-testid={`button-toggle-${quote.id}`}
                  >
                    {quote.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium">
                  {dayNames[quote.dayOfWeek]}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1" data-testid={`text-author-${quote.id}`}>
                  {quote.author}
                </h3>
                <p className="text-sm text-gray-600 mb-3" data-testid={`text-title-${quote.id}`}>
                  {quote.title}
                </p>
                {quote.quoteText && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-3">
                    "{quote.quoteText}"
                  </p>
                )}
                <Button
                  onClick={() => setEditingQuote(quote)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  data-testid={`button-edit-${quote.id}`}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Quote
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingQuote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Edit Quote - {dayNames[editingQuote.dayOfWeek]}</h2>
                  <Button
                    onClick={() => setEditingQuote(null)}
                    variant="ghost"
                    size="sm"
                    data-testid="button-close-edit"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Current Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </label>
                  <div className="aspect-square w-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img
                      src={editingQuote.imageUrl}
                      alt="Current quote"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Image
                  </label>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
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
                      <Button
                        onClick={handleImageUpload}
                        disabled={uploadImageMutation.isPending}
                        data-testid="button-upload-image"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadImageMutation.isPending ? "Uploading..." : "Upload Image"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day of Week
                    </label>
                    <select
                      value={editingQuote.dayOfWeek}
                      onChange={(e) =>
                        setEditingQuote({
                          ...editingQuote,
                          dayOfWeek: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      data-testid="select-day"
                    >
                      {dayNames.map((day, index) => (
                        <option key={index} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <Input
                      value={editingQuote.author}
                      onChange={(e) =>
                        setEditingQuote({
                          ...editingQuote,
                          author: e.target.value,
                        })
                      }
                      data-testid="input-author"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <Input
                      value={editingQuote.title}
                      onChange={(e) =>
                        setEditingQuote({
                          ...editingQuote,
                          title: e.target.value,
                        })
                      }
                      data-testid="input-title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quote Text (Optional)
                    </label>
                    <Textarea
                      value={editingQuote.quoteText || ""}
                      onChange={(e) =>
                        setEditingQuote({
                          ...editingQuote,
                          quoteText: e.target.value,
                        })
                      }
                      rows={3}
                      data-testid="input-quote-text"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={editingQuote.active || false}
                      onChange={(e) =>
                        setEditingQuote({
                          ...editingQuote,
                          active: e.target.checked,
                        })
                      }
                      data-testid="checkbox-active"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">
                      Active (visible in carousel)
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSaveQuote}
                    disabled={updateQuoteMutation.isPending}
                    className="flex-1"
                    data-testid="button-save-quote"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateQuoteMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setEditingQuote(null)}
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
    </div>
  );
}