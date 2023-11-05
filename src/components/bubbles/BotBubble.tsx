import { Show, onMount } from 'solid-js'
import { Avatar } from '../avatars/Avatar'
import { Marked, Renderer } from '@ts-stack/markdown'

type Props = {
  message: string
  showAvatar?: boolean
  avatarSrc?: string
  backgroundColor?: string
  textColor?: string
}

const defaultBackgroundColor = '#f7f8ff'
const defaultTextColor = '#303235'

class CustomRenderer extends Renderer {
  link(href: string, title: string, text: string): string {
    if (this.options.sanitize) {
      let prot: string;
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        prot = decodeURIComponent(this.options.unescape!(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
        return text;
      }
      if (prot.indexOf('data:') === 0) {
        return text;
      }
    }
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    // open link in new tab
    out += ' target="_blank">' + text + '</a>';
    return out;
  }
}

Marked.setOptions({ isNoP: true, renderer: new CustomRenderer() })

export const BotBubble = (props: Props) => {
  let botMessageEl: HTMLDivElement | undefined

  onMount(() => {
    if (botMessageEl) {
      botMessageEl.innerHTML = Marked.parse(props.message)
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
        class="px-4 py-2 ml-2 max-w-full chatbot-host-bubble prose"
        data-testid="host-bubble"
        style={{ "background-color": props.backgroundColor ?? defaultBackgroundColor, color: props.textColor ?? defaultTextColor, 'border-radius': '6px' }}
      />
    </div>
  )
}
