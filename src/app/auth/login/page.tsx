
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Shield, User, Briefcase, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Login Component
 * Simulates entry into the system using different role contexts.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { login } = useApp();
  const router = useRouter();

  const handleLogin = (role: 'USER' | 'STAFF' | 'ADMIN') => {
    if (!email) return;
    login(email, role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary bg-white">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline text-slate-900">Access Portal</CardTitle>
          <CardDescription>
            Authenticate with your credentials to manage property records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100">
                <TabsTrigger value="user" className="flex items-center gap-1 data-[state=active]:bg-white">
                  <User className="h-3.5 w-3.5" /> User
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-1 data-[state=active]:bg-white">
                  <Briefcase className="h-3.5 w-3.5" /> Staff
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1 data-[state=active]:bg-white">
                  <Key className="h-3.5 w-3.5" /> Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="mt-4">
                <p className="text-xs text-muted-foreground mb-4">Standard access to report lost items and browse the found registry.</p>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleLogin('USER')}>Sign in as User</Button>
              </TabsContent>
              
              <TabsContent value="staff" className="mt-4">
                <p className="text-xs text-muted-foreground mb-4">Authorized personnel access to register items and process claims.</p>
                <Button className="w-full bg-accent hover:bg-accent/90 text-white" onClick={() => handleLogin('STAFF')}>Sign in as Staff</Button>
              </TabsContent>
              
              <TabsContent value="admin" className="mt-4">
                <p className="text-xs text-muted-foreground mb-4">Full system control, database management, and policy oversight.</p>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" onClick={() => handleLogin('ADMIN')}>Sign in as Admin</Button>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            Secure Relational Environment
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
