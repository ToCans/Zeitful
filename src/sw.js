// src/sw.js
import { precacheAndRoute } from 'workbox-precaching';

// THIS LINE IS REQUIRED - don't remove it!
precacheAndRoute(self.__WB_MANIFEST);

// Your existing push notification code
self.addEventListener('push', (event) => {
	let pushData = event.data.json();
	if (!pushData || !pushData.title) {
		console.error('Received WebPush with an empty title. Received body: ', pushData);
		return;
	}
	event.waitUntil(
		self.registration.showNotification(pushData.title, pushData)
	);
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();
	if (!event.notification.data?.url) {
		console.error('Click on WebPush without url. Notification: ', event.notification);
		return;
	}
	event.waitUntil(
		clients.openWindow(event.notification.data.url)
	);
});