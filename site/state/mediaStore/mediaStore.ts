
import { observable, reaction } from 'mobx'

import { logger } from '../../../shared/logger'
import { setSource } from '../../audio/analyzer'
import { getAudioSource } from '../../audio/microphoneSource'

export type MediaStore = typeof mediaStore

export interface MediaProp {
  media: MediaStore
}

export const mediaStore = observable({
  ready: false,
  error: false,
  possibleDevices: [] as MediaDeviceInfo[],
  currentDeviceId: 'default',
})

async function setDevice (newDeviceId: string) {
  const newAudioSource = await getAudioSource(newDeviceId)
  setSource(newAudioSource)
}

reaction(
  () => mediaStore.currentDeviceId,
  setDevice,
  {
    fireImmediately: false,
  },
)

export async function updateDevices () {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    logger.debug('audio devices', devices)
    const possibleDevices = devices.filter(({ kind }) => kind === 'audioinput')
    mediaStore.possibleDevices = possibleDevices
    const currentDeviceId = mediaStore.currentDeviceId
    if (currentDeviceId !== 'default' && !devices.some(({ deviceId }) => deviceId === currentDeviceId)) {
      mediaStore.currentDeviceId = 'default'
    }
    mediaStore.ready = true
  } catch (err) {
    mediaStore.error = !!err
  }
}

if (navigator.mediaDevices) {
  navigator.mediaDevices.addEventListener('devicechange', () => updateDevices().catch(e => {
    logger.error('Failed to fetch media devices:', e)
  }))
}

// updateDevices().catch(e => {
//   logger.error('Failed to fetch media devices:', e)
// })
