import { useState } from "react";
import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  Home, 
  MessageSquareQuote, 
  Settings,
  LogOut,
  FileText,
  Users,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminGate from "@/components/AdminGate";
import QuotesAdmin from "./QuotesAdmin";
import SagesAdmin from "./admin/SagesAdmin";
import NutritionAdmin from "./admin/NutritionAdmin";
import AshramsAdmin from "./admin/AshramsAdmin";

type AdminSection = 'dashboard' | 'quotes' | 'sages' | 'nutrition' | 'ashrams';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  if (!isAuthenticated) {
    return <AdminGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotes' as AdminSection, label: 'Quotes of the Week', icon: Quote },
    { id: 'sages' as AdminSection, label: 'Sages', icon: User },
    { id: 'nutrition' as AdminSection, label: 'Inner Nutrition', icon: BookOpen },
    { id: 'ashrams' as AdminSection, label: 'Sacred Ashrams', icon: Home },
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'quotes':
        return <QuotesAdmin />;
      case 'sages':
        return <SagesAdmin />;
      case 'nutrition':
        return <NutritionAdmin />;
      case 'ashrams':
        return <AshramsAdmin />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management Dashboard</h1>
              <p className="text-gray-600">Manage all your spiritual content from one central location</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('quotes')}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Quote className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Quotes of the Week</CardTitle>
                  <CardDescription>Manage weekly spiritual quotes and images</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto text-blue-600 hover:text-blue-700">
                    Manage Quotes →
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('sages')}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Sages</CardTitle>
                  <CardDescription>Upload and manage sage biographies</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto text-green-600 hover:text-green-700">
                    Manage Sages →
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('nutrition')}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Inner Nutrition</CardTitle>
                  <CardDescription>Create and manage blog articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto text-purple-600 hover:text-purple-700">
                    Manage Articles →
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('ashrams')}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                    <Home className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Sacred Ashrams</CardTitle>
                  <CardDescription>Upload and manage ashram content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto text-orange-600 hover:text-orange-700">
                    Manage Ashrams →
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <div className="text-sm text-gray-500">Weekly Quotes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">9</div>
                    <div className="text-sm text-gray-500">Sages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-500">Articles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">10</div>
                    <div className="text-sm text-gray-500">Ashrams</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">The Nirvanist</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.id)}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}