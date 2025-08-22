import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminGateProps {
  onAuthenticated: () => void;
}

const ADMIN_PASSCODE = "211487";

export default function AdminGate({ onAuthenticated }: AdminGateProps) {
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (passcode === ADMIN_PASSCODE) {
        toast({
          title: "Access granted",
          description: "Welcome to the admin dashboard",
        });
        onAuthenticated();
      } else {
        toast({
          title: "Access denied",
          description: "Incorrect passcode. Please try again.",
          variant: "destructive",
        });
        setPasscode("");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Admin Access</CardTitle>
          <CardDescription>
            Enter the passcode to access the content management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="passcode" className="text-sm font-medium text-gray-700">
                Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="pl-10"
                  data-testid="input-passcode"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !passcode}
              data-testid="button-submit-passcode"
            >
              {isLoading ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-sm text-gray-500 hover:text-gray-700"
              data-testid="button-go-back"
            >
              ← Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}