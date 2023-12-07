import { TypingBubble } from '@/components';

export const LoadingBubble = () => (
  <div class="flex justify-start mb-4 items-start animate-fade-in host-container">
    <span class="px-4 py-4 ml-2 max-w-full chatbot-host-bubble prose" data-testid="host-bubble">
      <TypingBubble />
    </span>
  </div>
);
