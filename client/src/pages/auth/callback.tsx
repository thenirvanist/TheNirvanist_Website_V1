import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          setStatus('error');
          setErrorMessage('Authentication service is not configured.');
          return;
        }

        // Get the auth callback data from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Email verification failed.');
          
          toast({
            title: "Verification Failed",
            description: error.message || "There was a problem verifying your email.",
            variant: "destructive",
          });
          return;
        }

        if (data.session) {
          // User is authenticated, verification successful
          setStatus('success');
          
          toast({
            title: "Email Verified!",
            description: "Welcome to our spiritual community. You can now sign in.",
          });

          // Redirect to login after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          // Check URL parameters for error
          const urlParams = new URLSearchParams(window.location.search);
          const error = urlParams.get('error');
          const errorDescription = urlParams.get('error_description');

          if (error) {
            setStatus('error');
            setErrorMessage(errorDescription || 'Email verification failed.');
            
            toast({
              title: "Verification Failed",
              description: errorDescription || "There was a problem verifying your email.",
              variant: "destructive",
            });
          } else {
            // No session and no error - might be an expired or invalid link
            setStatus('error');
            setErrorMessage('The verification link may be expired or invalid.');
          }
        }
      } catch (error: any) {
        console.error('Unexpected auth callback error:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred during verification.');
        
        toast({
          title: "Verification Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader className="text-white text-2xl animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Email</h2>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your email address...
            </p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Welcome to our spiritual community! Your email has been verified and your account is now active.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,59%)] text-white py-3 rounded-lg font-semibold"
              >
                Sign In Now
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="w-full hover:bg-gray-100"
              >
                Go to Home
              </Button>
            </div>
          </>
        );

      case 'error':
        return (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {errorMessage || 'There was a problem verifying your email address.'}
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/register')}
                className="w-full bg-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,59%)] text-white py-3 rounded-lg font-semibold"
              >
                Try Registering Again
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="w-full hover:bg-gray-100"
              >
                Already Have an Account? Sign In
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-2 bg-[hsl(75,64%,49%)]"></div>
            
            <CardContent className="px-8 py-12 text-center">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}