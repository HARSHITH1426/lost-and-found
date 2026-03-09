
"use client"

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, ClipboardList, Package, Clock, ShieldAlert, Bell } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { currentUser, lostItems, foundItems, claims, isLoading } = useApp();

  if (!currentUser) return <div className="p-20 text-center">Identifying user context...</div>;

  const myLost = lostItems.filter(i => i.reportedByUserId === currentUser.id);
  const myClaims = claims.filter(c => c.claimingUserId === currentUser.id);
  const pendingClaims = claims.filter(c => c.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-slate-900">Portal: {currentUser.displayName}</h1>
          <p className="text-muted-foreground">Access Level: {currentUser.role}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/items/search"><Button variant="outline" className="gap-2"><Search className="h-4 w-4" /> Browse Database</Button></Link>
          {currentUser.role === 'USER' ? (
            <Link href="/lost-items/report"><Button className="bg-primary gap-2"><PlusCircle className="h-4 w-4" /> New Report</Button></Link>
          ) : (
            <Link href="/found-items/register"><Button className="bg-accent gap-2"><PlusCircle className="h-4 w-4" /> Log Entry</Button></Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Package className="h-5 w-5 text-primary" />} label="Database Items" value={foundItems.length} />
        <StatCard icon={<Clock className="h-5 w-5 text-orange-500" />} label="Active Reports" value={lostItems.length} />
        <StatCard icon={<ClipboardList className="h-5 w-5 text-accent" />} label="Queue size" value={pendingClaims.length} />
        <StatCard icon={<ShieldAlert className="h-5 w-5 text-red-500" />} label="Your Activity" value={myClaims.length + myLost.length} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Package className="h-5 w-5" /> Recent Records</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <p>Syncing...</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Identifer</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(currentUser.role === 'USER' ? myLost : foundItems).slice(0, 10).map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5" /> Claims Tracker</CardTitle></CardHeader>
          <CardContent>
            {myClaims.length === 0 ? <p className="text-sm text-muted-foreground">No active claims initiated.</p> : (
              <div className="space-y-4">
                {myClaims.map(c => (
                  <div key={c.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold">Ref: {c.id.slice(-6)}</p>
                      <Badge>{c.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">{label}</p>
          <p className="text-2xl font-bold font-headline">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
