import { Renderer } from '@ts-stack/markdown';

export class BotBubbleRenderer extends Renderer {
  image(href: string, title: string, text: string): string {
    let out = '<img src="' + href + '" alt="' + text + '"';

    if (title) {
      out += ' title="' + title + '"';
    }

    const css: { [key: string]: any } = {};
    const url = new URL(href, window.location.href);
    if (url.searchParams.has('width')) {
      css['max-width'] = url.searchParams.get('width') + 'px';
    }
    if (url.searchParams.has('height')) {
      css['max-height'] = url.searchParams.get('height') + 'px';
    }
    if (Object.keys(css).length > 0) {
      out += ' style="';
      for (const key in css) {
        out += key + ':' + css[key] + ';';
      }
      out += '"';
    }

    out += this.options.xhtml ? '/>' : '>';

    return out;
  }

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

    if (href === '#') {
      let out = '<button';
      out +=
        ' class="not-prose py-1 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" ';
      out += '>' + text + '</button>';
      return out;
    } else {
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      // open link in new tab
      if (!href.startsWith('#')) {
        out += ' target="_blank"';
      }
      out += ' >' + text + '</a>';
      return out;
    }
  }
}
