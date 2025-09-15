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
  const { user, isAdmin, loading, error, signIn, signUp } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter both email and password");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    const result = await signUp(email, password, "Admin User");

    if (result?.error) {
      setAuthError(result.error.message);
    } else {
      setAuthError("Admin account created successfully! You can now sign in.");
      setShowSignup(false);
      setEmail("");
      setPassword("");
    }
    
    setAuthLoading(false);
  };

  const createDefaultAdmin = async () => {
    setAuthLoading(true);
    setAuthError(null);

    const result = await signUp("choptym237@gmail.com", "password", "Default Admin");

    if (result?.error) {
      setAuthError(result.error.message);
    } else {
      setAuthError("Default admin account created successfully! Email: choptym237@gmail.com, Password: password");
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
          {!showSignup ? (
            <>
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

              <div className="mt-4 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowSignup(true)}
                  disabled={authLoading}
                >
                  Create Admin Account
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={createDefaultAdmin}
                  disabled={authLoading}
                >
                  Create Default Admin (choptym237@gmail.com)
                </Button>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    If you created an account but can't sign in, check your email for a confirmation link. 
                    Or contact admin to disable email confirmation in Supabase settings.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter admin email"
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
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Creating Account..." : "Create Admin Account"}
                </Button>
              </form>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setShowSignup(false);
                  setEmail("");
                  setPassword("");
                  setAuthError(null);
                }}
                disabled={authLoading}
              >
                Back to Sign In
              </Button>
            </>
          )}

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