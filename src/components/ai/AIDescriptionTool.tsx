
"use client"

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateItemDescription } from '@/ai/flows/generate-item-description';
import { useToast } from '@/hooks/use-toast';

interface AIDescriptionToolProps {
  category: string;
  keywords: string;
  additionalDetails?: string;
  onGenerated: (description: string) => void;
}

export default function AIDescriptionTool({ 
  category, 
  keywords, 
  additionalDetails, 
  onGenerated 
}: AIDescriptionToolProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!category || !keywords) {
      toast({
        title: "Missing Info",
        description: "Please select a category and add some keywords first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateItemDescription({
        category,
        keywords,
        additionalDetails: additionalDetails || ''
      });
      onGenerated(result.description);
      toast({
        title: "AI Help Ready",
        description: "Generated a detailed description for you!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation Failed",
        description: "Could not generate description at this time.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm" 
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2 border-accent text-accent hover:bg-accent hover:text-white transition-all"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      Use AI Assistant
    </Button>
  );
}
