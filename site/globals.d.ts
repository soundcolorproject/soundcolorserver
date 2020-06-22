
///<reference types="gtag.js" />

declare const __JEST__: boolean
declare const __REMOTE_API__: boolean
declare const __LOG_LEVEL__: 'debug' | 'info' | 'log' | 'warn' | 'error' | 'fatal' | 'none'
declare const __DEV__: boolean
declare const __BUILD_VERSION__: string
declare const __APP_MODE__: boolean

declare module '*.webm' {
  const result: string
  export default result
}

declare module '*.png' {
  const result: string
  export default result
}

declare module '*.svg' {
  const result: any
  export default result
}

declare module '*.frag' {
  const result: string
  export default result
}

declare module '*.vert' {
  const result: string
  export default result
}

declare type WakeLockType = 'screen'

declare interface WakeLockSentinel extends EventTarget {
  readonly type: WakeLockType
  release (): Promise<void>
  onRelease?: (ev: Event) => void
}

declare interface WakeLock {
  request (type: WakeLockType): Promise<WakeLockSentinel>
}

interface Navigator {
  readonly wakeLock?: WakeLock
}

declare const gtagPatched: typeof gtag
interface Window {
  gtagPatched: typeof gtag
}

declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
}
