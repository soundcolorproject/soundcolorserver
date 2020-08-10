
import { action, reaction } from 'mobx'

import { logger } from '../../../shared/logger'
import { setSource } from '../../audio/analyzer'
import { getAudioSource } from '../../audio/microphoneSource'

// export type MediaStore = typeof mediaStore

export interface MediaProp {
  media: MediaStore
}

export class MediaStore {
  constructor () {
    reaction(
      () => this.currentDeviceId,
      this._setDevice,
      {
        fireImmediately: false,
      },
    )

    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => this.updateDevices().catch(e => {
        logger.error('Failed to fetch media devices:', e)
      }))
    }
  }

  ready = false
  error = false
  possibleDevices: MediaDeviceInfo[] = []
  currentDeviceId = 'default'

  @action
  async updateDevices () {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      logger.debug('audio devices', devices)
      const possibleDevices = devices.filter(({ kind }) => kind === 'audioinput')
      this.possibleDevices = possibleDevices
      const currentDeviceId = this.currentDeviceId
      if (currentDeviceId !== 'default' && !devices.some(({ deviceId }) => deviceId === currentDeviceId)) {
        this.currentDeviceId = 'default'
      }
      this.ready = true
    } catch (err) {
      this.error = !!err
    }
  }

  private async _setDevice (newDeviceId: string) {
    const newAudioSource = await getAudioSource(newDeviceId)
    setSource(newAudioSource)
  }
}

export const mediaStore = new MediaStore()
