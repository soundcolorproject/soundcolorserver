
import { context, resumePromise } from './context'

let currentMedia: MediaStream | null = null

export async function getUserMedia (deviceId = 'default') {
  const newMedia = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: deviceId !== 'default' ? { exact: deviceId } : undefined,
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
    },
  })

  if (newMedia !== currentMedia) {
    stopUserMedia()
  }
  currentMedia = newMedia

  return newMedia
}

export function stopUserMedia () {
  if (currentMedia) {
    currentMedia.getAudioTracks().forEach(track => track.stop())
    currentMedia = null
  }
}

export async function getAudioSource (deviceId = 'default') {
  const stream = await getUserMedia(deviceId)
  await resumePromise
  const source = context.createMediaStreamSource(stream)
  return source
}
