import { Marked } from '@ts-stack/markdown';
import { Show, onMount } from 'solid-js';

import { Avatar } from '../avatars/Avatar';
import { BotBubbleRenderer } from './BotBubbleRenderer';
import { useMail } from '../useMail';

type Props = {
  message: string
  showAvatar?: boolean
  avatarSrc?: string
  backgroundColor?: string
  textColor?: string
  submit: (value: string) => void
}

const defaultBackgroundColor = '#f7f8ff'
const defaultTextColor = '#303235'

Marked.setOptions({ isNoP: true, renderer: new BotBubbleRenderer() })

export const BotBubble = (props: Props) => {
  let botMessageEl: HTMLDivElement | undefined;
  const [mailOpen, setMailOpen] = useMail();

  onMount(() => {
    if (botMessageEl) {
      botMessageEl.innerHTML = Marked.parse(props.message)
      const pickstoLinks = botMessageEl.querySelectorAll('a[href^="picksto:"]');
      pickstoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setMailOpen(true, link.getAttribute('href'));
        });
      });

      const buttons = botMessageEl.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          props.submit(button.innerText);
        });
      });
    }
  })

  return (
    <div
      class="flex justify-start mb-4 items-start host-container"
      style={{ 'margin-right': '50px' }}
    >
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
      <span
        ref={botMessageEl}
        class="px-4 py-2 ml-2 max-w-full chatbot-host-bubble prose prose-a:text-blue-600 hover:prose-a:text-blue-500"
        data-testid="host-bubble"
        style={{ "background-color": props.backgroundColor ?? defaultBackgroundColor, color: props.textColor ?? defaultTextColor, 'border-radius': '6px' }}
      />
    </div>
  )
}
