import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Book, Mountain, Compass, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { Bookmark, Sage, Ashram, BlogPost, Journey } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Login Required",
        description: "Please login to access your dashboard.",
        variant: "destructive"
      });
    }
  }, [authLoading, user, toast]);

  // Fetch bookmarks and all content to display bookmarked items
  const { data: bookmarks = [], isLoading: bookmarksLoading } = useQuery<Bookmark[]>({
    queryKey: ["/api/bookmarks"],
    enabled: !!user,
    retry: false
  });

  const { data: sages = [] } = useQuery<Sage[]>({
    queryKey: ["/api/sages"],
    enabled: !!user && bookmarks.length > 0
  });

  const { data: ashrams = [] } = useQuery<Ashram[]>({
    queryKey: ["/api/ashrams"],
    enabled: !!user && bookmarks.length > 0
  });

  const { data: blogs = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    enabled: !!user && bookmarks.length > 0
  });

  const { data: journeys = [] } = useQuery<Journey[]>({
    queryKey: ["/api/journeys"],
    enabled: !!user && bookmarks.length > 0
  });

  if (authLoading || bookmarksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-gray-600 mb-4">
              Please login to access your personal dashboard.
            </p>
            <Link href="/login">
              <Button className="w-full">
                Login to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get bookmarked content by type
  const getBookmarkedContent = (contentType: string, contentList: any[]) => {
    const bookmarkedIds = bookmarks
      .filter((bookmark: Bookmark) => bookmark.contentType === contentType)
      .map((bookmark: Bookmark) => bookmark.contentId);
    
    return contentList.filter((item: any) => bookmarkedIds.includes(item.id));
  };

  const bookmarkedSages = getBookmarkedContent("sage", sages);
  const bookmarkedAshrams = getBookmarkedContent("ashram", ashrams);
  const bookmarkedBlogs = getBookmarkedContent("blog", blogs);
  const bookmarkedJourneys = getBookmarkedContent("journey", journeys);

  const totalBookmarks = bookmarks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome, {user.firstName || user.email}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your Personal Spiritual Collection
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg text-amber-700">
              <Heart className="h-6 w-6 fill-red-500 text-red-500" />
              <span className="font-semibold">
                {totalBookmarks} {totalBookmarks === 1 ? 'item' : 'items'} bookmarked
              </span>
            </div>
          </div>

          {/* Empty State */}
          {totalBookmarks === 0 && (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-4">Start Your Collection</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your personal dashboard is ready! Start exploring and bookmarking spiritual content 
                  that resonates with you. Look for the heart icon on any sage, ashram, blog post, 
                  or journey to save it here.
                </p>
                <div className="space-y-3">
                  <Link href="/sages">
                    <Button variant="outline" className="w-full sm:w-auto mr-0 sm:mr-3 mb-3 sm:mb-0">
                      <Book className="h-4 w-4 mr-2" />
                      Explore Sages
                    </Button>
                  </Link>
                  <Link href="/ashrams">
                    <Button variant="outline" className="w-full sm:w-auto mr-0 sm:mr-3 mb-3 sm:mb-0">
                      <Mountain className="h-4 w-4 mr-2" />
                      Visit Ashrams
                    </Button>
                  </Link>
                  <Link href="/inner-nutrition">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Compass className="h-4 w-4 mr-2" />
                      Read Articles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bookmarked Content Sections */}
          {totalBookmarks > 0 && (
            <div className="space-y-12">
              {/* Bookmarked Sages */}
              {bookmarkedSages.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Book className="h-6 w-6 mr-2 text-amber-600" />
                      Bookmarked Sages ({bookmarkedSages.length})
                    </h2>
                    <Link href="/sages">
                      <Button variant="outline" size="sm">
                        View All Sages
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedSages.map((sage) => (
                      <Link key={sage.id} href={`/sages/${sage.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={sage.image || "/api/placeholder/400/250"}
                              alt={sage.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{sage.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{sage.location}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{sage.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookmarked Ashrams */}
              {bookmarkedAshrams.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Mountain className="h-6 w-6 mr-2 text-green-600" />
                      Bookmarked Ashrams ({bookmarkedAshrams.length})
                    </h2>
                    <Link href="/ashrams">
                      <Button variant="outline" size="sm">
                        View All Ashrams
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedAshrams.map((ashram) => (
                      <Link key={ashram.id} href={`/ashrams/${ashram.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={ashram.image || "/api/placeholder/400/250"}
                              alt={ashram.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{ashram.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{ashram.location}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{ashram.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookmarked Blog Posts */}
              {bookmarkedBlogs.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Compass className="h-6 w-6 mr-2 text-blue-600" />
                      Bookmarked Articles ({bookmarkedBlogs.length})
                    </h2>
                    <Link href="/inner-nutrition">
                      <Button variant="outline" size="sm">
                        View All Articles
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedBlogs.map((blog) => (
                      <Link key={blog.id} href={`/inner-nutrition/${blog.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={blog.image || "/api/placeholder/400/250"}
                              alt={blog.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{blog.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{blog.author}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{blog.excerpt}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookmarked Sacred Journeys */}
              {bookmarkedJourneys.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Compass className="h-6 w-6 mr-2 text-purple-600" />
                      Bookmarked Journeys ({bookmarkedJourneys.length})
                    </h2>
                    <Link href="/sacred-journeys">
                      <Button variant="outline" size="sm">
                        View All Journeys
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedJourneys.map((journey) => (
                      <Link key={journey.id} href={`/sacred-journeys/${journey.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={journey.image || "/api/placeholder/400/250"}
                              alt={journey.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{journey.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{journey.location}</p>
                            <p className="text-sm text-gray-600 mb-2">{journey.duration} • {journey.price}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{journey.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}