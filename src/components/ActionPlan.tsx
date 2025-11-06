import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import jsPDF from 'jspdf';
import { Download, Home } from 'lucide-react';

export const ActionPlan = () => {
  const navigate = useNavigate();
  const { actionPlan, formData } = useApp();

  useEffect(() => {
    if (!actionPlan) {
      navigate('/');
    }
  }, [actionPlan, navigate]);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(217, 119, 6); // Primary color
    pdf.text('habithole', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(16);
    pdf.setTextColor(69, 26, 3); // Dark brown
    pdf.text('Your Personalized Action Plan', margin, yPosition);
    yPosition += 15;

    // Date
    pdf.setFontSize(10);
    pdf.setTextColor(120, 53, 15);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 15;

    // Plan content
    pdf.setFontSize(11);
    pdf.setTextColor(69, 26, 3);
    
    const lines = actionPlan.split('\n');
    lines.forEach((line) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      if (line.startsWith('#')) {
        // Header
        pdf.setFontSize(line.startsWith('##') ? 13 : 16);
        pdf.setFont(undefined, 'bold');
        const headerText = line.replace(/^#+\s*/, '');
        pdf.text(headerText, margin, yPosition);
        yPosition += 8;
      } else if (line.trim()) {
        // Regular text
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        const splitText = pdf.splitTextToSize(line, maxWidth);
        pdf.text(splitText, margin, yPosition);
        yPosition += splitText.length * 6;
      } else {
        yPosition += 4;
      }
    });

    pdf.save('habithole-action-plan.pdf');
  };

  const handleStartNew = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 md:p-12 shadow-[var(--shadow-medium)]">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Amazing Work! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              You've taken the first step toward real change. Here's your personalized action plan:
            </p>
          </div>

          <div className="prose prose-sm md:prose-base max-w-none mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {actionPlan.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-2xl md:text-3xl font-bold text-foreground mt-6 mb-4">
                    {line.replace('# ', '')}
                  </h1>
                );
              } else if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl md:text-2xl font-semibold text-foreground mt-5 mb-3">
                    {line.replace('## ', '')}
                  </h2>
                );
              } else if (line.startsWith('- ')) {
                return (
                  <li key={index} className="text-foreground ml-4">
                    {line.replace('- ', '')}
                  </li>
                );
              } else if (line.trim()) {
                return (
                  <p key={index} className="text-foreground mb-2">
                    {line}
                  </p>
                );
              }
              return <br key={index} />;
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Button size="lg" onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-5 w-5" />
              Download as PDF
            </Button>
            <Button size="lg" variant="secondary" onClick={handleStartNew} className="gap-2">
              <Home className="h-5 w-5" />
              Start a New Plan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
