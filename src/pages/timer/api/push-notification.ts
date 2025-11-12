// Type Imports
import type { SettingsContextType } from '../../../types/context';
// Utils Imports
import { urlBase64ToUint8Array } from '../utils/push-notification-utils';


// Send Push Notification Functions
export const sendPushNotification = async (settings: SettingsContextType) => {
	if (settings.subscription.current !== null) {
		try {
			// Sends notification based on cycle number
			const response = await fetch(
				'https://cozystudy-server.vercel.app/api/send-push-notifications',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						cycleNumber: settings.cycleNumber,
						pushSubscription: settings.subscription.current,
					}),
				}
			);

			// Notification Server Response
			if (response.ok) {
				console.log('Notification request sent to server!');
			} else {
				console.error('Failed to send notification');
			}
		} catch (error) {
			console.error('Error sending notification:', error);
		}
	}
};

// Subscribe to Push Notifications Function
export const subscribeToPush = async (settings: SettingsContextType): Promise<void> => {
	// No settings context handling
	if (!settings) {
		console.warn('Settings context is not available');
		return;
	}

	// Service Worker and Push Manager Handling
	try {
		// Service Worker Registration
		const swRegistration = await navigator.serviceWorker.getRegistration();
		if (!swRegistration) {
			console.log('Service worker not registered');
			return;
		}

		// Push Manager Handling
		const pushManager = swRegistration.pushManager;
		if (!pushManager) {
			console.log('No push manager available');
			return;
		}

		// Public Vapid Key and Push Notifcation Setup
		const vapidPublicKey = 'BKcJp8Aq5hki25jJsakB9Gcazick4XBYw_tnazGj6F7WNUi5TPAdevrd6O1OfbsLN_uZQM1LidLrFVuuycyv0Qs';
		const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
		const pushSubscription = await pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: convertedVapidKey,
		});

		// Sets push manager subscription if it doesn't exist already
		if (settings.subscription?.current !== undefined) {
			settings.subscription.current = pushSubscription;
		}
	} catch (error) {
		console.log('Subscription error', error);
	}
};
