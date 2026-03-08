
"use client"

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Search, Filter, Calendar, MapPin, Tag, ArrowUpRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FoundItem } from '@/lib/types';

export default function SearchItems() {
  const { foundItems, currentUser, createClaim } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [claimDescription, setClaimDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredItems = foundItems.filter(item => 
    item.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClaim = () => {
    if (!currentUser) {
      toast({ title: "Login Required", description: "You must be signed in to make a claim.", variant: "destructive" });
      return;
    }
    if (!selectedItem || !claimDescription) return;

    createClaim({
      foundItemId: selectedItem.id,
      userId: currentUser.id,
      userName: currentUser.name,
      description: claimDescription
    });

    toast({
      title: "Claim Submitted",
      description: "The staff will review your claim and verify your ownership proof.",
    });
    
    setClaimDescription('');
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Find Your Belongings</h1>
          <p className="text-muted-foreground">Search through all items securely registered by our staff.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10 h-12 rounded-xl shadow-sm"
            placeholder="Search by keywords, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none shadow-sm flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                    {item.category}
                  </Badge>
                  <Badge className={item.status === 'OPEN' ? 'bg-green-500' : 'bg-slate-400'}>
                    {item.status}
                  </Badge>
                </div>
                <CardTitle className="font-headline text-xl">{item.keywords}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
                <div className="space-y-2 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> {item.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t p-4 mt-auto">
                <Dialog open={isDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                   setIsDialogOpen(open);
                   if (open) setSelectedItem(item);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2"
                      disabled={item.status !== 'OPEN'}
                    >
                      {item.status === 'OPEN' ? (
                        <>Claim this Item <ArrowUpRight className="h-4 w-4" /></>
                      ) : 'Claimed'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-headline">Submit Ownership Claim</DialogTitle>
                      <DialogDescription>
                        For "{item.keywords}". Provide details that only the owner would know (e.g., serial number, distinctive marks, wallpaper, contents).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="proof">Ownership Proof & Description</Label>
                        <Textarea 
                          id="proof"
                          rows={5}
                          placeholder="Describe identifiable features to verify ownership..."
                          value={claimDescription}
                          onChange={(e) => setClaimDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleClaim} className="bg-accent hover:bg-accent/90">Submit Claim Request</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Package(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
