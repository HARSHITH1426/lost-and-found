
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
import DescriptionHelper from '@/components/helpers/DescriptionHelper';
import { ShieldAlert } from 'lucide-react';

const CATEGORIES = ["Electronics", "Wallet/Keys", "Documents", "Clothing", "Jewelry", "Bags/Luggage", "Other"];

export default function ReportLostItem() {
  const { addLostItem, currentUser } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!currentUser) return <div className="p-12 text-center">Loading session...</div>;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.title || !form.description) {
      toast({ title: "Form Error", description: "All fields are required.", variant: "destructive" });
      return;
    }

    addLostItem(form);
    toast({ title: "Success", description: "Item report submitted to the database." });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldAlert className="h-6 w-6" />
            <span className="font-bold uppercase tracking-wider text-xs">System Entry</span>
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Report Lost Property</CardTitle>
          <CardDescription>Enter details below to assist in matching with found items.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Category</Label>
                <Select onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Identification Title</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Silver iPhone" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location Last Seen</Label>
                <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Room, Building, etc." />
              </div>
              <div className="space-y-2">
                <Label>Approximate Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Full Description</Label>
                <DescriptionHelper 
                  category={form.category} 
                  keywords={form.title} 
                  onUpdate={v => setForm({...form, description: v})} 
                />
              </div>
              <Textarea rows={6} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Back</Button>
              <Button type="submit" className="bg-primary px-8">Submit Report</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
