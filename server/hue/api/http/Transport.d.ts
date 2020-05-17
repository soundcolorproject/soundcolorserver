
import Bottleneck from 'bottleneck'

export interface Transport {
  configureLimiter(opts: Bottleneck.ConstructorOptions): void
}
