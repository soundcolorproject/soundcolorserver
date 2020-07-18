
export function smoothSize (lowSize: string, highSize: string, startAt: string, endAt: string) {
  return `calc(${lowSize}px + (100vw - ${startAt}px) / ((${endAt} - ${startAt}) / (${highSize} - ${lowSize})))`
}
