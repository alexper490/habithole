import { Message as MessageType } from '@/context/AppContext';

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)] animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-card text-card-foreground border border-primary/10 rounded-bl-sm'
        }`}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};
