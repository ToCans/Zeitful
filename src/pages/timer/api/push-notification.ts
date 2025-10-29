import type { SettingsContextType } from "../../../types/context";

export const sendPushNotification = async (settings: SettingsContextType) => {
    if (settings.subscription.current !== null) {
        try {
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