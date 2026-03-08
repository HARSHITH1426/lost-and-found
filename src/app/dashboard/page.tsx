
"use client"

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, ClipboardList, Package, Clock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { currentUser, lostItems, foundItems, claims } = useApp();

  if (!currentUser) return null;

  const myLostItems = lostItems.filter(item => item.reportedBy === currentUser.id);
  const myClaims = claims.filter(claim => claim.userId === currentUser.id);
  const pendingClaims = claims.filter(claim => claim.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-slate-900">Welcome, {currentUser.name}</h1>
          <p className="text-muted-foreground">Institution Portal • {currentUser.role} Account</p>
        </div>
        <div className="flex gap-3">
          <Link href="/items/search">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" /> Search Items
            </Button>
          </Link>
          {currentUser.role === 'USER' ? (
            <Link href="/lost-items/report">
              <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Report Lost
              </Button>
            </Link>
          ) : (
            <Link href="/found-items/register">
              <Button className="bg-accent hover:bg-accent/90 flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Register Found
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Package className="h-5 w-5 text-primary" />} 
          label="Total Found" 
          value={foundItems.length} 
        />
        <StatCard 
          icon={<Clock className="h-5 w-5 text-orange-500" />} 
          label="Active Reports" 
          value={lostItems.length} 
        />
        <StatCard 
          icon={<ClipboardList className="h-5 w-5 text-accent" />} 
          label="Pending Claims" 
          value={pendingClaims.length} 
        />
        <StatCard 
          icon={<ShieldAlert className="h-5 w-5 text-red-500" />} 
          label="Recent Activity" 
          value={myClaims.length + myLostItems.length} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* User Specific Content */}
          {currentUser.role === 'USER' && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" /> My Reported Lost Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myLostItems.length === 0 ? (
                  <EmptyState message="You haven't reported any lost items yet." />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myLostItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.keywords}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'OPEN' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {/* Staff Content */}
          {(currentUser.role === 'STAFF' || currentUser.role === 'ADMIN') && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" /> Recent Found Items (Staff Log)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {foundItems.length === 0 ? (
                  <EmptyState message="No found items registered in the database." />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date Logged</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foundItems.slice(0, 5).map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.keywords}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'OPEN' ? 'secondary' : 'default'} className={item.status === 'CLAIMED' ? 'bg-green-100 text-green-700' : ''}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" /> My Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myClaims.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active claims found.</p>
              ) : (
                <div className="space-y-4">
                  {myClaims.map(claim => (
                    <div key={claim.id} className="p-3 border rounded-lg space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold">Claim #{claim.id.split('-')[1]}</p>
                        <Badge variant={claim.status === 'PENDING' ? 'outline' : 'default'} className={
                          claim.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : 
                          claim.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''
                        }>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{claim.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-xl">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold font-headline">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-muted-foreground italic">{message}</p>
    </div>
  );
}

function Bell(props: any) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
