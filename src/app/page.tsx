
"use client"

import Link from 'next/link';
import { Shield, Search, ArrowRight, CheckCircle2, Lock, UserCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/store';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const { currentUser } = useApp();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image 
            src={heroImage?.imageUrl || ''} 
            alt="Background" 
            fill 
            className="object-cover"
            data-ai-hint="blue abstract"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-medium border border-white/20">
              <Shield className="h-4 w-4" />
              Secure RBAC Architecture
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold font-headline leading-tight">
              Smart Lost & Found <br />
              <span className="text-accent">Management System</span>
            </h1>
            <p className="text-lg text-blue-50 max-w-xl">
              A robust relational database architecture designed for institutions to securely manage, report, and claim lost items with role-based access control.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {currentUser ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-primary hover:bg-blue-50">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button size="lg" className="bg-white text-primary hover:bg-blue-50">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/items/search">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Search Items <Search className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden lg:block relative">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle2 className="text-accent h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">System Health: Optimal</h3>
                    <p className="text-sm text-blue-200">DB Server: Connected</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-blue-200">Lost Reported</p>
                    <p className="text-2xl font-bold">1,248</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-blue-200">Found Items</p>
                    <p className="text-2xl font-bold">856</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-blue-200">Claims Verified</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-blue-200">Avg. Claim Time</p>
                    <p className="text-2xl font-bold">2.4 days</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold font-headline text-primary">Advanced Architecture Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system utilizes a 3-tier architecture with a secure relational database layer to ensure data integrity and privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Lock className="h-6 w-6 text-primary" />}
              title="Secure RBAC"
              description="Granular permissions for Users, Staff, and Admins. Ensure that only authorized personnel can verify claims or modify records."
            />
            <FeatureCard 
              icon={<UserCheck className="h-6 w-6 text-primary" />}
              title="Claim Verification"
              description="A structured workflow for users to submit ownership proof and for staff to systematically verify claims."
            />
            <FeatureCard 
              icon={<Search className="h-6 w-6 text-primary" />}
              title="Dynamic Search"
              description="Real-time filtering and search capabilities indexed for high performance across thousands of item records."
            />
            <FeatureCard 
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Detailed Reporting"
              description="Comprehensive metadata capture for items including categories, locations, dates, and visual descriptions."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Data Integrity"
              description="Relational database schema with strict foreign key constraints and audit logging for every transaction."
            />
            <FeatureCard 
              icon={<ArrowRight className="h-6 w-6 text-primary" />}
              title="AI-Powered Descriptions"
              description="Integrated generative AI to help users create detailed, searchable descriptions for lost or found items."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow group">
      <div className="bg-primary/5 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-headline text-slate-900">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
