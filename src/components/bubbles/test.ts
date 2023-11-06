import { URL } from 'url'

const props = Object.fromEntries(new URL('send-mail:exdatis.com?foo=1&bar=2').searchParams)
props
