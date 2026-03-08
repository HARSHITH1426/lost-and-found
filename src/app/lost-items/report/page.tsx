
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
import { ShieldAlert } from 'lucide-react';

const CATEGORIES = [
  "Electronics",
  "Wallet/Keys",
  "Documents",
  "Clothing",
  "Jewelry",
  "Bags/Luggage",
  "Other"
];

export default function ReportLostItem() {
  const { addLostItem, currentUser } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    category: '',
    keywords: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!currentUser || currentUser.role !== 'USER') {
    return <div className="p-12 text-center text-destructive">Unauthorized Access. Only registered users can report lost items.</div>;
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

    addLostItem(form);
    toast({
      title: "Report Submitted",
      description: "Your lost item has been registered in our database.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldAlert className="h-6 w-6" />
            <span className="font-bold uppercase tracking-wider text-xs">Official Report</span>
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Report Lost Item</CardTitle>
          <CardDescription>
            Provide as much detail as possible to help the staff identify your item.
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
                <Label htmlFor="keywords">Item Name/Keywords *</Label>
                <Input 
                  id="keywords" 
                  placeholder="e.g. iPhone 13, Black Wallet" 
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Last Seen Location *</Label>
                <Input 
                  id="location" 
                  placeholder="e.g. Campus Library, Gate B" 
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Approximate Date Lost *</Label>
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
                <Label htmlFor="description">Detailed Description *</Label>
                <AIDescriptionTool 
                  category={form.category}
                  keywords={form.keywords}
                  onGenerated={(desc) => setForm({ ...form, description: desc })}
                />
              </div>
              <Textarea 
                id="description" 
                rows={6} 
                placeholder="Describe unique features, condition, or items inside..." 
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Security Note: Do not share passwords or sensitive private keys.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">Submit Report</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
