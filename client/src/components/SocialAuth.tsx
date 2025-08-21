import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaApple, FaFacebook, FaTwitter, FaMicrosoft } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

/**
 * SocialAuth Component
 * 
 * A standalone React component that provides social authentication buttons
 * for Google, Apple, Facebook, X.com (Twitter), and Microsoft using Supabase Auth.
 * 
 * Features:
 * - Five social login options with branded icons
 * - Loading states for each button
 * - Error handling with toast notifications
 * - Responsive design with Tailwind CSS
 * - Full TypeScript support
 */

interface SocialAuthProps {
  /** Optional callback function called after successful authentication */
  onSuccess?: () => void;
  /** Optional callback function called after authentication error */
  onError?: (error: string) => void;
  /** Custom redirect URL after authentication (defaults to current domain) */
  redirectTo?: string;
}

export const SocialAuth: React.FC<SocialAuthProps> = ({ 
  onSuccess, 
  onError, 
  redirectTo 
}) => {
  const [loadingState, setLoadingState] = useState<{
    google: boolean;
    apple: boolean;
    facebook: boolean;
    twitter: boolean;
    microsoft: boolean;
  }>({
    google: false,
    apple: false,
    facebook: false,
    twitter: false,
    microsoft: false,
  });

  const { toast } = useToast();

  /**
   * Handles social authentication for a specific provider
   */
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook' | 'twitter' | 'azure') => {
    try {
      // Set loading state for the specific provider - handle both 'azure' (provider) and 'microsoft' (UI state)
      const stateKey = provider === 'azure' ? 'microsoft' : provider;
      setLoadingState(prev => ({ ...prev, [stateKey]: true }));

      // Prepare authentication options
      const authOptions = {
        provider,
        options: {
          // Redirect to the current domain or custom URL after authentication
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
          // Request additional scopes if needed
          scopes: provider === 'google' ? 'email profile' : 
                  provider === 'azure' ? 'email profile' :
                  provider === 'twitter' ? 'tweet.read users.read' : undefined,
        },
      };

      // Attempt to sign in with the selected OAuth provider
      const { data, error } = await supabase.auth.signInWithOAuth(authOptions);

      if (error) {
        throw error;
      }

      // Show success message
      toast({
        title: "Authentication Started",
        description: `Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)} for authentication...`,
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      // Handle and display authentication errors
      const errorMessage = error.message || `Failed to authenticate with ${provider}`;
      
      console.error(`${provider} authentication error:`, error);
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      // Reset loading state - handle both 'azure' (provider) and 'microsoft' (UI state)
      const stateKey = provider === 'azure' ? 'microsoft' : provider;
      setLoadingState(prev => ({ ...prev, [stateKey]: false }));
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Component Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Continue with Social Account
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred authentication method
        </p>
      </div>

      {/* Social Authentication Buttons */}
      <div className="space-y-3">
        
        {/* Google Authentication Button */}
        <Button
          onClick={() => handleSocialLogin('google')}
          disabled={loadingState.google}
          className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
          variant="outline"
        >
          {loadingState.google ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <FaGoogle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-gray-700">
            {loadingState.google ? 'Connecting...' : 'Login with Google'}
          </span>
        </Button>

        {/* Apple Authentication Button */}
        <Button
          onClick={() => handleSocialLogin('apple')}
          disabled={loadingState.apple}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
        >
          {loadingState.apple ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
          ) : (
            <FaApple className="w-5 h-5 text-white" />
          )}
          <span>
            {loadingState.apple ? 'Connecting...' : 'Login with Apple'}
          </span>
        </Button>

        {/* Facebook Authentication Button */}
        <Button
          onClick={() => handleSocialLogin('facebook')}
          disabled={loadingState.facebook}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
        >
          {loadingState.facebook ? (
            <div className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
          ) : (
            <FaFacebook className="w-5 h-5 text-white" />
          )}
          <span>
            {loadingState.facebook ? 'Connecting...' : 'Login with Facebook'}
          </span>
        </Button>

        {/* X.com (Twitter) Authentication Button */}
        <Button
          onClick={() => handleSocialLogin('twitter')}
          disabled={loadingState.twitter}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
        >
          {loadingState.twitter ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
          ) : (
            <FaTwitter className="w-5 h-5 text-white" />
          )}
          <span>
            {loadingState.twitter ? 'Connecting...' : 'Login with X.com'}
          </span>
        </Button>

        {/* Microsoft Authentication Button */}
        <Button
          onClick={() => handleSocialLogin('azure')}
          disabled={loadingState.microsoft}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
        >
          {loadingState.microsoft ? (
            <div className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
          ) : (
            <FaMicrosoft className="w-5 h-5 text-white" />
          )}
          <span>
            {loadingState.microsoft ? 'Connecting...' : 'Login with Microsoft'}
          </span>
        </Button>
      </div>

      {/* Additional Information */}
      <div className="text-center mt-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SocialAuth;