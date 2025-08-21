import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

/**
 * AuthCallback Component
 * 
 * This page handles OAuth authentication callbacks from social providers.
 * It processes the authentication result and redirects the user appropriately.
 */

export default function AuthCallback() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session after OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Authentication callback error:', error);
          // Redirect to login with error
          navigate('/login?error=auth_callback_failed');
          return;
        }

        if (session) {
          // Successfully authenticated - redirect to home
          console.log('User authenticated successfully:', session.user);
          navigate('/');
        } else {
          // No session found - redirect to login
          navigate('/login?error=no_session');
        }
      } catch (error) {
        console.error('Error processing auth callback:', error);
        navigate('/login?error=callback_error');
      }
    };

    // Process the callback after a short delay to ensure URL params are processed
    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-2 brand-primary"></div>
            
            <CardContent className="px-8 py-12 text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-white text-2xl" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Authentication</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Please wait while we complete your sign-in process...
              </p>
              
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-[hsl(75,64%,49%)] border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <p className="text-xs text-gray-500 mt-6">
                You will be redirected automatically in a few moments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}