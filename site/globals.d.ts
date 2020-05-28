
declare const __REMOTE_API__: boolean
declare const __LOG_LEVEL__: 'debug' | 'info' | 'log' | 'warn' | 'error' | 'fatal' | 'none'
declare const __DEV__: boolean
declare const __BUILD_NUMBER__: string

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
