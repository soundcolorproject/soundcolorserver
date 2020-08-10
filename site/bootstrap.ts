
import { mediaStore } from './state/mediaStore'

export async function bootstrap () {
  await Promise.all([mediaStore.updateDevices()])
}
