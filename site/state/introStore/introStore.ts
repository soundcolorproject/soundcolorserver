
import { observable, reaction } from 'mobx'

import { patternsStore } from '../patternsStore'
import { renderStateStore, togglePattern } from '../renderStateStore'

export interface IntroStoreProp {
  intro: IntroStore
}

export class IntroStore {
  constructor () {
    const warningAccepted = sessionStorage.getItem('warningAccepted')
    const seenHowItWorks = sessionStorage.getItem('seenHowItWorks')

    this.warningAccepted = warningAccepted === 'true'
    this.seenHowItWorks = seenHowItWorks === 'true'

    reaction(
      () => this.warningAccepted,
      (b) => {
        sessionStorage.setItem('warningAccepted', b.toString())
      },
    )
    reaction(
      () => this.seenHowItWorks,
      (b) => {
        sessionStorage.setItem('seenHowItWorks', b.toString())
      },
    )
    reaction(
      () => [this.warningAccepted, this.seenHowItWorks],
      ([a, b]) => {
        if (a && b && !renderStateStore.showColors) {
          togglePattern(patternsStore, renderStateStore)
        }
      },
    )
  }

  @observable warningAccepted: boolean
  @observable seenHowItWorks: boolean
}

export const introStore = new IntroStore()
