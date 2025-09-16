import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, Lock } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading, error, signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Get redirect path and access denied state
  const from = location.state?.from || "/admin";
  const accessDenied = location.state?.accessDenied;

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (user && isAdmin && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, loading, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter both email and password");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    await signIn(email, password);

    if (!error) {
      // The useEffect above will handle the redirect once the auth state updates
      setEmail("");
      setPassword("");
    } else {
      setAuthError(error);
    }
    
    setAuthLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show access denied if authenticated but not admin
  if (user && !isAdmin && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              You don't have administrator privileges to access this panel. Please contact a system administrator if you believe this is an error.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate("/")} 
                className="w-full"
                variant="outline"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  window.location.reload();
                }} 
                className="w-full"
                variant="secondary" 
                size="sm"
              >
                Sign in as different user
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Admin Access Required
          </CardTitle>
          {accessDenied && (
            <p className="text-sm text-muted-foreground mt-2">
              Administrator privileges required to access this area
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {(authError || error) && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {authError || error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <Lock className="h-3 w-3 inline mr-1" />
              Secure admin login • Only authorized personnel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}