
declare const __REMOTE_API__: boolean
declare const __LOG_LEVEL__: 'debug' | 'info' | 'log' | 'warn' | 'error' | 'fatal' | 'none'
declare const __DEV__: boolean

declare module '*.svg' {
  const result: any
  export = result
}

declare module '*.frag' {
  const result: string
  export default result
}

declare module '*.vert' {
  const result: string
  export default result
}
