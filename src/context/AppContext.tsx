import { createContext, useContext, useState, ReactNode } from 'react';

export interface FormData {
  name: string;
  goalType: 'build' | 'break' | '';
  priorityLevel: 'life-changing' | 'important' | 'exploring' | '';
  pastAttempts: 'never' | 'once-twice' | 'multiple' | '';
  timeframe: '2-weeks' | '1-2-months' | '3-plus-months' | '';
  supportSystem: 'none' | 'friends-family' | 'accountability-partner' | '';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AppContextType {
  formData: FormData;
  setFormData: (data: FormData) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  conversationComplete: boolean;
  setConversationComplete: (complete: boolean) => void;
  actionPlan: string;
  setActionPlan: (plan: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    goalType: '',
    priorityLevel: '',
    pastAttempts: '',
    timeframe: '',
    supportSystem: '',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [actionPlan, setActionPlan] = useState('');

  return (
    <AppContext.Provider
      value={{
        formData,
        setFormData,
        messages,
        setMessages,
        conversationComplete,
        setConversationComplete,
        actionPlan,
        setActionPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
