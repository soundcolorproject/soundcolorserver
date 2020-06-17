
import { logger } from '../shared/logger'
import { renderStateStore } from './state/renderStateStore'

let registration: ServiceWorkerRegistration | null = null

export async function requestPushSubscription () {
  if (!registration) return null

  try {
    const pushSubscription = await registration.pushManager.subscribe({
      applicationServerKey: 'BB2-V7oaDOjLdQkwhjGoya2YLPkq4h88GPQdVOMDQyIB-NH8wHX_BGApwg1SdC1YTc08XKiOrEWRsRhKa7J3ZVg',
      userVisibleOnly: true,
    })

    renderStateStore.pushSubscriptionState = 'subscribed'

    return pushSubscription
  } catch (err) {
    logger.warn('Failed to subscribe to push notifications:', err)
    renderStateStore.pushSubscriptionState = 'rejected'

    return null
  }
}

async function loadServiceWorker () {
  try {
    renderStateStore.serviceWorkerState = 'installing'
    logger.info('Registering service worker...')
    registration = await navigator.serviceWorker.register('/sw.js')
    logger.info('Service worker registered:', registration)
    renderStateStore.serviceWorkerState = 'active'
    renderStateStore.pushSubscriptionState = 'awaiting request'
  } catch (err) {
    logger.warn('Service worker registration failed:', err)
    renderStateStore.serviceWorkerState = 'failed'
  }
}

export function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    renderStateStore.pushSubscriptionState = 'pending service worker'
    window.addEventListener('load', () => {
      loadServiceWorker().catch(err => {
        logger.error('Something went wrong wile registering the service worker:', err)
        renderStateStore.serviceWorkerState = 'failed'
      })
    })
  } else {
    renderStateStore.serviceWorkerState = 'not supported'
  }
}
