import { Message } from '@/context/AppContext';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const sendMessage = async (
  messages: Message[],
  systemPrompt: string
): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment.');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

export const generateActionPlan = async (
  messages: Message[],
  formData: any
): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const goalType = formData.goalType;
  const planPrompt = goalType === 'build' 
    ? `Based on this conversation, generate a detailed, personalized habit building action plan following this EXACT structure and format:

# Your Habit Building Plan

Created: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

## Your Identity Statement

I am [type of person who does this habit from Step 2]

## Your Tiny Habit

[The smallest 2-minute version of the habit that counts from Step 3]

## Your Trigger

After I [existing habit from Step 4], I will [new tiny habit from Step 3]

Time: [Specific time if time-based from Step 4]

Location: [Specific place from Step 4]

## Make It Easy

Prepare:

[What to set up the night before/in advance from Step 7]

[Visual cue/reminder to place from Step 7]

Remove barriers:

[Specific friction to eliminate from Step 5]

## Make It Satisfying

Right after I complete my habit, I will:

→ [Immediate reward/celebration within seconds from Step 6]

## Track Your Progress

[Specific tracking method - calendar X's, jar of clips, app checkbox, etc. from Step 8]

## Your If-Then Plans

If I miss one day → I will [specific recovery action from Step 9]

If [likely obstacle from Step 9] → I will [alternative action from Step 9]

If [another obstacle from Step 9] → I will [workaround from Step 9]

## Remember

Your ONLY goal is [tiny habit from Step 3].

Everything else is bonus.

Two days of tiny success beats one ambitious failure.

## Track This

Days completed: ___/7

Check-in date: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

## Remember

[Personalized encouraging reminder based on their specific situation and motivation - you can always do more, but this is all you need to do from Step 2]`
    : `Based on this conversation, generate a detailed, personalized habit breaking action plan following this EXACT structure and format:

# Your Habit Change Plan

Created: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

## The Habit You're Changing

[Specific behavior to stop from Step 1]

## What It Really Gives You

[The underlying craving/need this habit satisfies - stress relief, escape, stimulation, control, comfort, connection, etc. from Step 3]

## Your Replacement Routine

When you feel the urge:

→ [Primary replacement that satisfies the same craving from Step 4]

Alternative: [Backup option if primary isn't available from Step 4]

## Change Your Environment

[Remove specific cues/triggers from environment from Step 5]

[Add barriers/friction to make habit harder from Step 5]

[Set up replacement tools/items in convenient locations from Step 5]

## Your If-Then Plans

If [specific high-risk trigger from Step 6] → I will [specific replacement action from Step 6]

If [another common trigger from Step 6] → I will [specific action from Step 6]

If [you slip/already started] → I will [immediate recovery action from Step 7]

## When the Urge Hits

Cravings peak in 15-20 minutes then pass.

[Specific delay/distraction strategy to ride it out from Step 7]

## When You Slip

One slip ≠ failure.

Just follow the plan again tomorrow.

[Number] good days out of seven is a win.

## Track This

[What to track - days following plan, urge frequency, etc. from conversation]

Check-in date: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

## Remember

[Personalized encouraging reminder based on their specific situation and motivation from Step 2]`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: planPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate action plan');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Action Plan Generation Error:', error);
    throw error;
  }
};
