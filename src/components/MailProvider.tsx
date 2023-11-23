/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Modal } from 'flowbite';
import { Accessor, Component, createContext, createEffect, createSignal, onMount } from 'solid-js';

export const MailContext = createContext<[Accessor<boolean>, (open: boolean, href: string | null) => void]>();

export const MailProvider: Component<{ children: any }> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [href, setHref] = createSignal<string | null>(null);
  const [error, setError] = createSignal<boolean | null>(null);
  const [loading, setLoading] = createSignal<boolean>(false);

  let dialogRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;
  let modal: Modal | undefined;

  createEffect(() => {
    if (open()) {
      setError(null);
      modal?.show();
    } else {
      modal?.hide();
    }
  });

  onMount(() => {
    modal = new Modal(dialogRef!, {
      onShow: () => setOpen(true),
      onHide: () => setOpen(false),
    });
    modal._createBackdrop = () => { /**/ };
    modal._destroyBackdropEl = () => { /**/ };
  });

  const sendPicks = (recipient?: string) => {
    const endpoint = href();
    if (endpoint && recipient) {
      setLoading(true);
      const url = new URL(endpoint.replace("picksto:", "https:"));
      fetch(`https://${url.host}${url.pathname}`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          ids: url.searchParams.get('ids'),
          mail_to: recipient
        }),
      }).then((resp) => {
        if (resp.ok) {
          setError(false);
        } else {
          setError(true);
          throw new Error(`Could not send mail: ${resp.statusText}`);
        }
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <MailContext.Provider value={[open, (open, href) => {
      setOpen(open);
      setHref(href);
    }]}>
      { open() && 
        <div modal-backdrop class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0" style={{"z-index": "9999"}} />
      }
      <div
        ref={dialogRef}
        tabindex="-1"
        aria-hidden="false"
        class="dialog fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        style={{"z-index": "10000"}}
      >
        <div class="relative w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
            <div class="px-6 py-6 lg:px-8">
              <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Your Personalized Product Picks
              </h3>
              <form class="space-y-6" action="#" onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sendPicks(inputRef?.value);
              }}>
                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    ref={inputRef}
                    type="email"
                    name="email"
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    required />
                </div>
                <button
                  type="submit"
                  disabled={error() === false}
                  class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75"
                >
                  { loading() ?
                    <>
                      <svg aria-hidden="true" role="status" class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                      </svg>
                      Sending picks...
                    </> : <>
                      Send Picks
                    </>
                  }
                </button>
              </form>
              { error() === false  &&
                <div class="mt-1 text-blue-700 center" role="alert">
                  <span class="block sm:inline">Your message was sent successfully!</span>
                </div>
              }
              { error() === true  &&
                <div class="mt-1 text-red-700 center" role="alert">
                  <span class="block sm:inline">Email could not be sent. Please try again later.</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      {props.children}
    </MailContext.Provider>
  );
}