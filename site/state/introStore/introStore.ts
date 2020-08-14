
import { action, observable, reaction } from 'mobx'

import { patternsStore } from '../patternsStore'
import { renderStateStore } from '../renderStateStore'

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
      () => [this.startPattern, this.warningAccepted, this.seenHowItWorks],
      ([a, b, c]) => {
        if (a && b && c) {
          renderStateStore.startPattern(patternsStore)
        }
      },
    )
  }

  @observable startPattern = true
  @observable warningAccepted: boolean
  @observable seenHowItWorks: boolean

  @action
  _resolveAllPanels () {
    this.startPattern = false
    this.warningAccepted = true
    this.seenHowItWorks = true
  }

  @action
  _showPanels () {
    this.startPattern = true
    this.warningAccepted = false
    this.seenHowItWorks = false
  }
}

export const introStore = new IntroStore()
