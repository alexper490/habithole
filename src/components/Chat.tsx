import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Message } from '@/components/Message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sendMessage, generateActionPlan } from '@/utils/openai';
import { getSystemPrompt } from '@/utils/frameworks';
import { Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AboutDialog } from '@/components/AboutDialog';

export const Chat = () => {
  const navigate = useNavigate();
  const { formData, messages, setMessages, setConversationComplete, setActionPlan } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [infoClicked, setInfoClicked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!formData.goalType) {
      navigate('/');
      return;
    }

    if (messages.length === 0) {
      const goalTypeText = formData.goalType === 'build' ? 'build' : 'break';
      const userName = formData.name || 'there';
      const intro = `Hi ${userName}! I'm excited to help you ${goalTypeText} this habit. Let's start by understanding exactly what you want to work on. Can you describe the specific habit you have in mind?`;
      
      setMessages([{ role: 'assistant', content: intro }]);
    }
  }, [formData, messages.length, navigate, setMessages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = getSystemPrompt(formData);
      const response = await sendMessage(newMessages, systemPrompt);

      const assistantMessage = { role: 'assistant' as const, content: response };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Check if conversation is complete
      if (response.toLowerCase().includes('i have everything i need to create your personalized plan')) {
        setConversationComplete(true);
        
        // Generate action plan
        setTimeout(async () => {
          try {
            const plan = await generateActionPlan(updatedMessages, formData);
            setActionPlan(plan);
            navigate('/plan');
          } catch (error) {
            toast({
              title: 'Error generating plan',
              description: error instanceof Error ? error.message : 'Please try again',
              variant: 'destructive',
            });
            setIsLoading(false);
          }
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error sending message',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Track progress based on the most recent assistant message to determine current step
  const progress = useMemo(() => {
    const totalSteps = formData.goalType === 'build' ? 9 : 7;
    
    if (messages.length === 0) {
      return {
        currentStep: 0,
        totalSteps,
        percentage: 0
      };
    }
    
    // Get assistant messages (excluding intro)
    const assistantMessages = messages.filter(m => m.role === 'assistant').slice(1);
    
    if (assistantMessages.length === 0) {
      return {
        currentStep: 1,
        totalSteps,
        percentage: (1 / totalSteps) * 100
      };
    }
    
    // Focus on the MOST RECENT assistant message to determine current step
    const latestMessage = assistantMessages[assistantMessages.length - 1].content.toLowerCase();
    
    let estimatedStep = 0;
    
    if (formData.goalType === 'build') {
      // Step-specific indicators - prioritized by specificity (most specific first)
      const stepIndicators = [
        // Step 1: Habit Specification
        ['describe the specific habit', 'what exactly do you want to', 'specific habit you have in mind', 'what specific habit'],
        // Step 2: Motivation & Identity
        ['why does this matter', 'who do you want to become', 'what would change in your life', 'motivation', 'identity'],
        // Step 3: Scale Down to 2-minute
        ['2-minute', 'tiny habit', 'smallest version', 'minimum viable', 'worst day', 'scale down'],
        // Step 4: Trigger/Anchor
        ['trigger', 'anchor', 'existing habit', 'stack onto', 'after i', 'habit stacking', 'time or location'],
        // Step 5: Friction Assessment
        ['what gets in the way', 'friction', 'make it easier', 'what typically gets', 'barriers'],
        // Step 6: Immediate Reward
        ['celebration', 'satisfying', 'immediate', 'instant gratification', 'how will you celebrate', 'reward'],
        // Step 7: Environment Setup
        ['prepare', 'visual reminder', 'what can you prepare', 'visual reminders', 'environment setup', 'advance'],
        // Step 8: Tracking Method
        ['track', 'tracking', 'measure progress', 'how will you track', 'tracking method', 'feedback system'],
        // Step 9: Obstacle Planning
        ['obstacle', 'miss a day', 'if-then', 'what if', 'if i miss', 'scenarios']
      ];
      
      // Check the LATEST message against each step to find what it's asking about
      // Check from step 9 down to step 1 to catch the highest matching step
      for (let i = stepIndicators.length - 1; i >= 0; i--) {
        const indicators = stepIndicators[i];
        // Check if latest message contains indicators for this step
        const matchesStep = indicators.some(indicator => latestMessage.includes(indicator));
        if (matchesStep) {
          estimatedStep = i + 1;
          break; // Found the step, stop looking
        }
      }
    } else {
      // Breaking habits step indicators
      const stepIndicators = [
        // Step 1: Habit Specification
        ['specific behavior', 'what do you want to stop', 'describe exactly', 'what specific behavior'],
        // Step 2: Trigger Mapping
        ['when does this happen', 'where does this', 'feeling triggers', 'what feeling triggers', 'triggers'],
        // Step 3: Reward/Craving Discovery
        ['what do you get from', 'underlying need', 'what would you miss', 'what\'s the underlying', 'craving'],
        // Step 4: Replacement Routine
        ['replacement', 'alternative', 'instead of', 'satisfy that craving', 'replacement routine', 'what else could'],
        // Step 5: Environment Changes
        ['remove cues', 'barriers', 'environment changes', 'how can you remove', 'environment'],
        // Step 6: High-Risk Plan
        ['risky situation', 'high-risk', 'situations where', 'risky situations', 'if-then'],
        // Step 7: Urge Strategy
        ['urge', 'craving hits', '15-minute', 'slip recovery', 'urge strategy', 'when the craving']
      ];
      
      // Check the LATEST message against each step
      for (let i = stepIndicators.length - 1; i >= 0; i--) {
        const indicators = stepIndicators[i];
        const matchesStep = indicators.some(indicator => latestMessage.includes(indicator));
        if (matchesStep) {
          estimatedStep = i + 1;
          break; // Found the step, stop looking
        }
      }
    }
    
    // Conservative fallback: if we can't determine from latest message, estimate conservatively
    if (estimatedStep === 0 && assistantMessages.length > 0) {
      // Very conservative: assume roughly 1.5-2 messages per step
      estimatedStep = Math.min(Math.max(1, Math.floor(assistantMessages.length / 1.8)), totalSteps);
    }
    
    // Never show more progress than we have evidence for
    // Cap at total steps
    estimatedStep = Math.min(estimatedStep, totalSteps);
    
    // Calculate progress percentage
    const progressPercentage = (estimatedStep / totalSteps) * 100;
    
    return {
      currentStep: estimatedStep,
      totalSteps,
      percentage: progressPercentage
    };
  }, [messages, formData.goalType]);

  return (
    <div className="h-screen bg-gradient-to-br from-background via-card to-background flex flex-col overflow-hidden">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-10 shadow-[var(--shadow-soft)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-[65px] pb-[180px]">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-primary/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-[var(--shadow-soft)]">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur-sm fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Progress Bar */}
          {messages.length > 1 && (
            <div className="mb-3 opacity-60">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress.currentStep}/{progress.totalSteps}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="min-h-[60px] max-h-[200px] resize-none"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="shrink-0"
            >
              Send
            </Button>
          </div>
        </div>
      </footer>
      
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
};
