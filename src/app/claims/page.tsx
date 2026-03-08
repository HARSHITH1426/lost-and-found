
"use client"

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, User, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ClaimManagement() {
  const { claims, foundItems, updateClaimStatus, currentUser } = useApp();
  const { toast } = useToast();

  if (!currentUser || (currentUser.role !== 'STAFF' && currentUser.role !== 'ADMIN')) {
    return <div className="p-12 text-center text-destructive">Unauthorized Access. Only staff can verify claims.</div>;
  }

  const handleStatusUpdate = (claimId: string, status: 'APPROVED' | 'REJECTED') => {
    updateClaimStatus(claimId, status);
    toast({
      title: `Claim ${status}`,
      description: `The user has been notified of the ${status.toLowerCase()} decision.`,
    });
  };

  const getFoundItem = (id: string) => foundItems.find(f => f.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck className="h-6 w-6" />
            <h1 className="text-3xl font-bold font-headline">Claim Verification Module</h1>
          </div>
          <p className="text-muted-foreground">Review ownership proof submitted by users to facilitate secure item handover.</p>
        </div>
      </header>

      {claims.length === 0 ? (
        <div className="bg-white p-20 rounded-2xl text-center border">
          <p className="text-muted-foreground">No claim requests pending in the database.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {claims.map(claim => {
            const item = getFoundItem(claim.foundItemId);
            return (
              <Card key={claim.id} className="overflow-hidden border-none shadow-sm">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-slate-50 p-6 border-r flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-white uppercase tracking-tighter">Claim #{claim.id.split('-')[1]}</Badge>
                        <Badge className={
                          claim.status === 'PENDING' ? 'bg-orange-500' :
                          claim.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'
                        }>
                          {claim.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Claimant Details</p>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-primary" /> {claim.userName}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" /> {new Date(claim.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Linked Item</p>
                        <p className="font-bold text-slate-900">{item?.keywords || 'Deleted Item'}</p>
                        <p className="text-xs text-muted-foreground">{item?.category} • {item?.location}</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="md:w-2/3 p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg font-headline">Submitted Ownership Proof:</h3>
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 italic text-slate-700 leading-relaxed">
                        "{claim.description}"
                      </div>
                    </div>

                    {claim.status === 'PENDING' && (
                      <div className="flex gap-4 pt-8 border-t mt-8">
                        <Button 
                          onClick={() => handleStatusUpdate(claim.id, 'APPROVED')}
                          className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                        >
                          <CheckCircle className="h-4 w-4" /> Approve Claim
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleStatusUpdate(claim.id, 'REJECTED')}
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-2"
                        >
                          <XCircle className="h-4 w-4" /> Reject Claim
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
