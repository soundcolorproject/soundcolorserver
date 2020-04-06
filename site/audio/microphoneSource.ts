
import { context, resumePromise } from './context'

export async function getUserMedia (deviceId = 'default') {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: { exact: deviceId },
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
    },
  })
}

export async function getAudioSource (deviceId = 'default') {
  const stream = await getUserMedia(deviceId)
  await resumePromise
  return context.createMediaStreamSource(stream)
}
