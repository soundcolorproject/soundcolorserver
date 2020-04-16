
import { observable, reaction } from 'mobx'
import { getUserMedia, getAudioSource } from '../../audio/microphoneSource'
import { setSource as setSource1 } from '../../audio/analyzer'
import { setSource as setSource2 } from '../../audio/miniAnalyser'
import { logger } from '../../../shared/logger'

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
  setSource1(newAudioSource)
  setSource2(newAudioSource)
}

reaction(
  () => mediaStore.currentDeviceId,
  setDevice,
)

getUserMedia().then(() => {
  mediaStore.ready = true
}).catch(() => {
  mediaStore.error = true
})

async function updateDevices () {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const possibleDevices = devices.filter(({ kind }) => kind === 'audioinput')
  mediaStore.possibleDevices = possibleDevices
  const currentDeviceId = mediaStore.currentDeviceId
  if (!devices.some(({ deviceId }) => deviceId === currentDeviceId)) {
    mediaStore.currentDeviceId = 'default'
  } else {
    const deviceId = mediaStore.currentDeviceId
    setDevice(deviceId).catch(e => {
      logger.warn(`Failed to change media device to ${deviceId}:`, e)
    })
  }
}

if (navigator.mediaDevices) {
  navigator.mediaDevices.addEventListener('devicechange', () => updateDevices().catch(e => {
    logger.error('Failed to fetch media devices:', e)
  }))
}

updateDevices().catch(e => {
  logger.error('Failed to fetch media devices:', e)
})
