
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    const length= await fetch("http://ec2-15-206-93-14.ap-south-1.compute.amazonaws.com:5001/claims/allclaimsnumber");
    const lengthData = await length.json();
    console.log(lengthData);
    
    toast(
      "Login successful"+"Welcome back, " + email + ".",
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-medium animate-scale-in bg-[#1D1817]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-white">Sign In</CardTitle>
        <CardDescription className="text-center text-white">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-white">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="premium-input"
            />
          </div>
          <div className="space-y-2 text-white">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="premium-input"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div className="mb-2">Demo credentials:</div>
            <div>Patient: patient@example.com / password123</div>
            <div>Patient2: john@example.com / password123</div>
            <div>Insurer: insurer@example.com / password123</div>
          </div>
        </CardContent>
        <CardFooter>

          <Button 
            type="submit" 
            className="w-full premium-button bg-primary relative overflow-hidden border border-transparent group"
            disabled={loading}
          >
        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <span className="relative z-10 flex items-center">
                  Get Started
                </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
