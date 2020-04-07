
declare namespace Express {
  interface Request {
    getSessionId(): string
  }
}

declare interface HotModule {
  accept (callback: () => void): void
  accept (path: string, callback: () => void): void
  dispose (callback: () => void): void
}

declare interface NodeModule {
  hot?: HotModule
}
