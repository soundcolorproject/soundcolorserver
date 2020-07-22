
import { updateDevices } from './state/mediaStore'

export async function bootstrap () {
  await Promise.all([updateDevices()])
}
