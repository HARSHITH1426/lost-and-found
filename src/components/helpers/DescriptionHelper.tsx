
"use client"

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateItemDescription } from '@/ai/flows/generate-item-description';
import { useToast } from '@/hooks/use-toast';

interface Props {
  category: string;
  keywords: string;
  details?: string;
  onUpdate: (val: string) => void;
}

/**
 * Utility to assist in generating comprehensive descriptions.
 * Uses natural language processing to ensure clarity for system matching.
 */
export default function DescriptionHelper({ category, keywords, details, onUpdate }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleRequest = async () => {
    if (!category || !keywords) {
      toast({
        title: "Incomplete Form",
        description: "Please provide a category and keywords before using the helper.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { description } = await generateItemDescription({
        category,
        keywords,
        additionalDetails: details || ''
      });
      onUpdate(description);
    } catch (err) {
      toast({
        title: "Service Error",
        description: "The description helper is currently unavailable.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm" 
      onClick={handleRequest}
      disabled={isProcessing}
      className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
    >
      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      Generate Template
    </Button>
  );
}
