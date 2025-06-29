'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Copy, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Lazy load heavy dependencies
const loadHtml2Canvas = () => import('html2canvas');
const loadJsPDF = () => import('jspdf');

interface ShareDropdownProps {
  shareText: string;
  elementId: string;
  calculatorType: string;
}

export function ShareDropdown({ shareText, elementId, calculatorType }: ShareDropdownProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Calculation copied to clipboard!', {
        description: `You can now share your ${calculatorType} calculation results.`
      });
    } catch (error) {
      toast.error('Failed to copy to clipboard', {
        description: 'Please try again or copy the results manually.'
      });
    }
  }, [shareText, calculatorType]);

  const handleSaveAsImage = useCallback(async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      // Lazy load html2canvas
      const { default: html2canvas } = await loadHtml2Canvas();

      // Add a temporary class to improve image quality
      element.classList.add('export-mode');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Remove the temporary class
      element.classList.remove('export-mode');

      // Create download link
      const link = document.createElement('a');
      link.download = `${calculatorType.toLowerCase().replace(' ', '-')}-calculation.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Image saved successfully!', {
        description: 'Your calculation has been saved as a PNG image.'
      });
    } catch (error) {
      toast.error('Failed to save as image', {
        description: 'Please try again or use a different browser.'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [elementId, calculatorType]);

  const handleSaveAsPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      // Lazy load dependencies
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        loadHtml2Canvas(),
        loadJsPDF()
      ]);

      // Add a temporary class to improve PDF quality
      element.classList.add('export-mode');

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Remove the temporary class
      element.classList.remove('export-mode');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${calculatorType.toLowerCase().replace(' ', '-')}-calculation.pdf`);

      toast.success('PDF saved successfully!', {
        description: 'Your calculation has been saved as a PDF document.'
      });
    } catch (error) {
      toast.error('Failed to save as PDF', {
        description: 'Please try again or use a different browser.'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [elementId, calculatorType]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-xl"
          disabled={isGenerating}
        >
          <Share2 className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        <DropdownMenuItem onClick={handleCopyText} className="flex items-center gap-2 rounded-lg">
          <Copy className="w-4 h-4" />
          Copy as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSaveAsImage} className="flex items-center gap-2 rounded-lg">
          <Image className="w-4 h-4" />
          Save as Image
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSaveAsPDF} className="flex items-center gap-2 rounded-lg">
          <FileText className="w-4 h-4" />
          Save as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}