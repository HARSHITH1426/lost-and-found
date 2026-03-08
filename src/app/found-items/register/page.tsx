
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AIDescriptionTool from '@/components/ai/AIDescriptionTool';
import { PackageSearch } from 'lucide-react';

const CATEGORIES = [
  "Electronics",
  "Wallet/Keys",
  "Documents",
  "Clothing",
  "Jewelry",
  "Bags/Luggage",
  "Other"
];

export default function RegisterFoundItem() {
  const { addFoundItem, currentUser } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    category: '',
    keywords: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!currentUser || (currentUser.role !== 'STAFF' && currentUser.role !== 'ADMIN')) {
    return <div className="p-12 text-center text-destructive">Unauthorized Access. Only staff can register found items.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.keywords || !form.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addFoundItem(form);
    toast({
      title: "Item Registered",
      description: "Found item has been securely logged in the system.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="shadow-lg border-t-4 border-t-accent">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-accent mb-2">
            <PackageSearch className="h-6 w-6" />
            <span className="font-bold uppercase tracking-wider text-xs">Official Registry</span>
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Register Found Item</CardTitle>
          <CardDescription>
            Log a found item into the secure database. Only staff members can view the full details until a claim is verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(val) => setForm({ ...form, category: val })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Item Title *</Label>
                <Input 
                  id="keywords" 
                  placeholder="e.g. Blue Backpack, Samsung Phone" 
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Found At (Location) *</Label>
                <Input 
                  id="location" 
                  placeholder="e.g. Room 402, Cafeteria" 
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date Found *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Official Description *</Label>
                <AIDescriptionTool 
                  category={form.category}
                  keywords={form.keywords}
                  onGenerated={(desc) => setForm({ ...form, description: desc })}
                />
              </div>
              <Textarea 
                id="description" 
                rows={6} 
                placeholder="Include specific markers, condition, and any identifiable features not disclosed to public..." 
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 px-8 text-white">Log Item</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
