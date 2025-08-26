import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Bookmark } from "@shared/schema";

interface BookmarkButtonProps {
  contentType: "sage" | "ashram" | "blog" | "journey";
  contentId: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BookmarkButton({ 
  contentType, 
  contentId, 
  size = "md",
  className = ""
}: BookmarkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if item is bookmarked by fetching user's bookmarks
  const { data: bookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ["/api/bookmarks"],
    enabled: true, // Only fetch if user is likely logged in
    retry: false
  });

  const isBookmarked = bookmarks.some(
    (bookmark: Bookmark) => 
      bookmark.contentType === contentType && 
      bookmark.contentId === contentId
  ) || false;

  // Add bookmark mutation
  const addBookmark = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/bookmarks", {
        contentType,
        contentId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Bookmarked!",
        description: "Added to your personal collection.",
        variant: "default"
      });
    },
    onError: (error: any) => {
      if (error.message?.includes("401")) {
        toast({
          title: "Login Required",
          description: "Please login to bookmark content.",
          variant: "destructive"
        });
      } else if (error.message?.includes("409")) {
        toast({
          title: "Already Bookmarked",
          description: "This content is already in your collection.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to bookmark content. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Remove bookmark mutation
  const removeBookmark = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/bookmarks/${contentType}/${contentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Removed",
        description: "Removed from your collection.",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to remove bookmark. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookmarked) {
      removeBookmark.mutate();
    } else {
      addBookmark.mutate();
    }
  };

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }[size];

  const buttonSize = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5"
  }[size];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={addBookmark.isPending || removeBookmark.isPending}
      className={`
        ${buttonSize} 
        rounded-full 
        bg-white/90 
        backdrop-blur-sm 
        hover:bg-white 
        hover:scale-110 
        transition-all 
        duration-200 
        shadow-sm 
        ${className}
      `}
      data-testid={`bookmark-${contentType}-${contentId}`}
      title={isBookmarked ? "Remove from collection" : "Add to collection"}
    >
      {isBookmarked ? (
        <Heart 
          className={`${iconSize} fill-red-500 text-red-500`} 
        />
      ) : (
        <Heart 
          className={`${iconSize} text-gray-600 hover:text-red-500 transition-colors`} 
        />
      )}
    </Button>
  );
}