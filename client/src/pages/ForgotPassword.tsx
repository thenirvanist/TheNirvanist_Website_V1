import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
// Custom API request function for authentication
const authApiRequest = async (url: string, method = "GET", body?: any, headers?: Record<string, string>) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || `${response.status}: ${response.statusText}`;
    } catch {
      errorMessage = `${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
import { forgotPasswordSchema, type ForgotPasswordData } from "@shared/schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      return await authApiRequest("/api/auth/forgot-password", "POST", data);
    },
    onSuccess: () => {
      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPasswordMutation.mutate(data);
  };

  if (emailSent) {
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
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We've sent password reset instructions to your email address. Please follow the link in the email to reset your password.
                </p>
                
                <div className="space-y-4">
                  <Link href="/login">
                    <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold">
                      Back to Login
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setEmailSent(false)}
                    className="w-full hover:bg-gray-100"
                  >
                    Try Different Email
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="mb-8">
            <Link href="/login">
              <Button variant="ghost" className="mb-4 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-2 brand-primary"></div>
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-gray-900">Reset Password</CardTitle>
              <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 py-3 border-2 border-gray-200 focus:border-[hsl(75,64%,49%)] rounded-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <Link href="/login">
                    <button className="text-[hsl(75,64%,49%)] hover:underline font-semibold">
                      Sign In
                    </button>
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  We'll send you a secure link to reset your password. The link will expire in 1 hour for your security.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}