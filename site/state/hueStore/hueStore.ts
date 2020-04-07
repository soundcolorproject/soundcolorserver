
import { observable, computed, reaction, action } from 'mobx'
import { logger } from '../../../shared/logger'

export interface HueProp {
  hue: HueStore
}

export class HueStore {
  constructor () {
    // reaction(
    //   () => this.jwt,
    //   () => this.fetchUser(),
    // )
  }

  readonly remoteApi = !__REMOTE_API__
  @observable authenticated = false
}
