
"use client"

import Link from 'next/link';
import { Shield, Search, PlusCircle, LayoutDashboard, LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const { currentUser, logout, claims } = useApp();
  
  const pendingClaimsCount = claims.filter(c => c.status === 'PENDING').length;

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary tracking-tight font-headline">ItemSentry Pro</span>
            </Link>

            {currentUser && (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="/items/search" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
                  <Search className="h-4 w-4" /> Search
                </Link>
                {currentUser.role === 'USER' && (
                  <Link href="/lost-items/report" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
                    <PlusCircle className="h-4 w-4" /> Report Lost
                  </Link>
                )}
                {(currentUser.role === 'STAFF' || currentUser.role === 'ADMIN') && (
                  <Link href="/found-items/register" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
                    <PlusCircle className="h-4 w-4" /> Log Found
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!currentUser ? (
              <Link href="/auth/login">
                <Button variant="default" className="bg-primary hover:bg-primary/90">Sign In</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                {(currentUser.role === 'STAFF' || currentUser.role === 'ADMIN') && (
                  <Link href="/claims" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                    {pendingClaimsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-accent text-[10px] text-white">
                        {pendingClaimsCount}
                      </Badge>
                    )}
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                        <Badge variant="secondary" className="mt-1 w-fit text-[10px] uppercase">{currentUser.role}</Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
