
import type {Metadata} from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'ItemSentry Pro | Secure Lost & Found Management',
  description: 'A comprehensive solution for tracking lost and found items in institutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <AppProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="border-t bg-white py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} ItemSentry Pro. Relational Database Architecture Project.
                </p>
              </div>
            </footer>
            <Toaster />
          </AppProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
