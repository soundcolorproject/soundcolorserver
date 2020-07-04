
/// <reference lib="webworker" />

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

declare var self: ServiceWorkerGlobalScope

workbox.core.skipWaiting()
workbox.core.clientsClaim()

self.addEventListener('push', (event) => {
  const title = 'Sound Color Project'
  const data = event.data?.json()
  const options = {
    body: data?.body,
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

// This is necessary to put TS in module mode rather than ambient mode
// Otherwise TS will start yelling about redefining `self` from the definition in `lib.dom`
export default null
