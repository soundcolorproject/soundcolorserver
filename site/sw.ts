
/// <reference lib="webworker" />

import {} from './sw'

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

// export default null
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
