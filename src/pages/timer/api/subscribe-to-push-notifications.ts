// Type Imports //
import type { SettingsContextType } from '../../../types/context';

// Subscribe to Push Notifications Function //
export const subscribeToPush = async (settings: SettingsContextType): Promise<void> => {
    if (!settings) {
        console.warn('Settings context is not available');
        return;
    }

    try {
        const swRegistration = await navigator.serviceWorker.getRegistration();

        if (!swRegistration) {
            console.log('Service worker not registered');
            return;
        }

        const pushManager = swRegistration.pushManager;

        if (!pushManager) {
            console.log('No push manager available');
            return;
        }

        const subscriptionOptions = {
            userVisibleOnly: true,
            applicationServerKey: import.meta.env.REACT_APP_VAPID_PUBLIC_KEY,
        };

        const pushSubscription = await pushManager.subscribe(subscriptionOptions);

        if (settings.subscription?.current !== undefined) {
            settings.subscription.current = pushSubscription;
        }
    } catch (error) {
        console.log('Subscription error', error);
    }
};