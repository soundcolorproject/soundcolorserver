
declare const window: any
export let isBrowser = () => {
  const browser = typeof window !== 'undefined'
  isBrowser = () => browser
  return browser
}
