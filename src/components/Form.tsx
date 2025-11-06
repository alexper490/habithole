import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Info } from 'lucide-react';
import { AboutDialog } from '@/components/AboutDialog';

const questions = [
  {
    id: 'name',
    question: "What's your name?",
    type: 'text' as const,
  },
  {
    id: 'goalType',
    question: 'What do you want to work on?',
    type: 'choice' as const,
    options: [
      { value: 'build', label: 'Build a new habit' },
      { value: 'break', label: 'Break an existing habit' },
    ],
  },
  {
    id: 'priorityLevel',
    question: 'How important is this to you?',
    type: 'choice' as const,
    options: [
      { value: 'life-changing', label: 'Life-changing priority' },
      { value: 'important', label: 'Important but not urgent' },
      { value: 'exploring', label: 'Exploring/curious' },
    ],
  },
  {
    id: 'pastAttempts',
    question: 'Have you tried this before?',
    type: 'choice' as const,
    options: [
      { value: 'never', label: 'Never tried' },
      { value: 'once-twice', label: 'Tried once or twice' },
      { value: 'multiple', label: 'Multiple attempts' },
    ],
  },
  {
    id: 'timeframe',
    question: "What's your timeframe?",
    type: 'choice' as const,
    options: [
      { value: '2-weeks', label: 'Within 2 weeks' },
      { value: '1-2-months', label: '1-2 months' },
      { value: '3-plus-months', label: '3+ months (building long-term)' },
    ],
  },
  {
    id: 'supportSystem',
    question: 'Do you have support for this?',
    type: 'choice' as const,
    options: [
      { value: 'none', label: 'No one yet' },
      { value: 'friends-family', label: 'Close friends/family' },
      { value: 'accountability-partner', label: 'I have an accountability partner' },
    ],
  },
];

export const Form = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [infoClicked, setInfoClicked] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    const newFormData = { ...formData, [questionId]: value } as any;
    setFormData(newFormData);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleNameChange = (value: string) => {
    const newFormData = { ...formData, name: value } as any;
    setFormData(newFormData);
  };

  const handleNameSubmit = () => {
    if (formData.name.trim()) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const allAnswered = questions.every(q => {
      const value = formData[q.id as keyof typeof formData];
      return q.id === 'name' ? typeof value === 'string' && value.trim() !== '' : value !== '';
    });
    if (allAnswered) {
      navigate('/chat');
    }
  };

  const currentQ = questions[currentQuestion];
  const allAnswered = questions.every(q => {
    const value = formData[q.id as keyof typeof formData];
    return q.id === 'name' ? typeof value === 'string' && value.trim() !== '' : value !== '';
  });
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const canGoBack = currentQuestion > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 md:p-12 shadow-[var(--shadow-medium)]">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                habithole
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setAboutOpen(true);
                  setInfoClicked(true);
                }}
                className={`h-8 w-8 ${!infoClicked ? 'animate-pulse-color' : ''}`}
                aria-label="About the program"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
            {canGoBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-2xl font-semibold text-foreground flex-1">
              {currentQ.question}
            </h2>
          </div>

          {currentQ.type === 'text' ? (
            <div className="space-y-4">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && formData.name.trim()) {
                    handleNameSubmit();
                  }
                }}
                placeholder="Enter your name"
                className="text-lg"
                autoFocus
              />
              <Button
                size="lg"
                onClick={handleNameSubmit}
                disabled={!formData.name.trim()}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQ.options?.map((option) => (
                <Button
                  key={option.value}
                  variant="choice"
                  size="lg"
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className={
                    formData[currentQ.id as keyof typeof formData] === option.value
                      ? 'border-primary bg-primary/10'
                      : ''
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}

          {allAnswered && currentQ.id !== 'name' && (
            <Button
              size="lg"
              onClick={handleSubmit}
              className="w-full mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              Start Your Journey
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Your personalized habit construction/destruction experience
        </p>
      </Card>
      
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
};
