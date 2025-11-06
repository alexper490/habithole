import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  const [portfolioClicked, setPortfolioClicked] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg mx-4 w-[calc(100%-2rem)] sm:w-full sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-2xl">About habithole</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Website Link Section - Top */}
          <div className="pb-4 border-b">
            <p className="text-sm text-muted-foreground mb-3">
              For more programs and tools designed with evidence-based frameworks, visit:
            </p>
            <Button
              variant="outline"
              onClick={() => {
                window.open('https://alexperezportfolio.notion.site/Alex-Perez-273ce471044b805ab8b8e40b631dd541', '_blank');
                setPortfolioClicked(true);
              }}
              className={`w-full sm:w-auto ${!portfolioClicked ? 'animate-pulse-color' : ''}`}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              my portfolio
            </Button>
          </div>

          {/* About habithole Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Why "Just Do It" Doesn't Work</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Willpower alone is unreliable. Research shows that relying on motivation and discipline to build or break habits is inefficient and often leads to failure. The "just do it" approach ignores the psychological and environmental factors that actually drive behavior.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Building Systems Instead</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Success comes from creating systems, not relying on willpower. This program guides you through evidence-based frameworks that help you:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 ml-4">
              <li>Design tiny, sustainable habits that build over time</li>
              <li>Identify triggers and create environmental cues</li>
              <li>Remove friction and add immediate rewards</li>
              <li>Plan for obstacles before they happen</li>
              <li>Replace unwanted behaviors with alternatives that satisfy the same needs</li>
            </ul>
          </div>

          {/* Frameworks with Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-3">The Frameworks</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-base mb-2">Building Habits (9 Steps)</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li><strong>Habit Specification</strong> - Get specific, concrete action (from vague → measurable)</li>
                  <li><strong>Motivation & Identity Exploration</strong> - Why it matters and who you want to become</li>
                  <li><strong>Scale Down to Minimum Viable Habit</strong> - 2-minute version that removes intimidation</li>
                  <li><strong>Trigger/Anchor Identification</strong> - Find existing habit to stack onto OR reliable time/location cue</li>
                  <li><strong>Friction Assessment</strong> - What gets in the way? How to make it easier?</li>
                  <li><strong>Immediate Reward Design</strong> - Instant celebration/gratification that makes it satisfying immediately</li>
                  <li><strong>Environment Setup</strong> - What to prepare in advance and visual reminders/cues</li>
                  <li><strong>Tracking Method</strong> - How you'll measure progress with visible feedback system</li>
                  <li><strong>Obstacle Planning</strong> - What if you miss a day? Top 2-3 if-then scenarios</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2 italic">Core Principle: Start ridiculously small, make it easy</p>
              </div>
              
              <div>
                <h4 className="font-medium text-base mb-2">Breaking Habits (7 Steps)</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li><strong>Habit Specification</strong> - Define the specific behavior to stop</li>
                  <li><strong>Trigger Mapping</strong> ⚠️ Critical - When/where does this happen most? What feeling triggers it? Identify top 2-3 main triggers</li>
                  <li><strong>Reward/Craving Discovery</strong> ⚠️ MOST IMPORTANT - What do you get from this behavior? What would you miss most? Name the underlying need (stress relief, escape, stimulation, comfort, control)</li>
                  <li><strong>Replacement Routine</strong> - What else could satisfy that same craving? Generate 2-3 alternatives with equal or less effort and pick primary replacement</li>
                  <li><strong>Environment Changes</strong> - How to remove cues/reminders and what barriers can you add to make it harder?</li>
                  <li><strong>High-Risk Plan</strong> - 2 risky situations with if-then plans for each</li>
                  <li><strong>Urge Strategy</strong> - What to do when craving hits (15-minute rule) and slip recovery plan</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Credits Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Frameworks & Research Credits</h3>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div>
                <p className="font-medium mb-1">Key Frameworks & Methods:</p>
                <ul className="list-disc list-inside space-y-1 ml-3">
                  <li><strong>Atomic Habits</strong> by James Clear - Habit stacking, environment design, identity-based habits</li>
                  <li><strong>Tiny Habits</strong> by BJ Fogg - 2-minute rule, celebration/instant rewards, starting ridiculously small</li>
                  <li><strong>The Power of Habit</strong> by Charles Duhigg - Cue-routine-reward loop, habit replacement</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium mb-1">Psychological & Cognitive Principles:</p>
                <ul className="list-disc list-inside space-y-1 ml-3">
                  <li><strong>Behavioral Psychology</strong> - Operant conditioning, reinforcement schedules, environmental cues</li>
                  <li><strong>Implementation Intentions</strong> (Gollwitzer & Sheeran) - If-then planning for obstacle management</li>
                  <li><strong>Self-Determination Theory</strong> - Intrinsic motivation, autonomy, and identity-based change</li>
                  <li><strong>Cognitive Load Theory</strong> - Reducing friction and making habits easier to execute</li>
                  <li><strong>Extinction Burst</strong> - Understanding temporary habit intensification during breaking</li>
                  <li><strong>Urge Surfing</strong> - Mindfulness-based approach to riding out cravings</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium mb-1">Research Foundations:</p>
                <ul className="list-disc list-inside space-y-1 ml-3">
                  <li>
                    Studies on willpower depletion and the limitations of self-control{' '}
                    <a 
                      href="https://www.sciencedirect.com/science/article/pii/S2352250X24000952" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Research
                    </a>
                  </li>
                  <li>
                    Environmental psychology and behavior change{' '}
                    <a 
                      href="https://www.sciencedirect.com/science/article/pii/S2352154617301602" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Research
                    </a>
                  </li>
                  <li>
                    Habit formation neuroscience (dorsal striatum, automaticity research){' '}
                    <a 
                      href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6657020/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Research
                    </a>
                  </li>
                  <li>
                    Evidence-based interventions for behavior modification{' '}
                    <a 
                      href="https://www.aafp.org/pubs/fpm/issues/2018/0300/p31.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Research
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

