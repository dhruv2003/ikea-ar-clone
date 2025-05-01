"use client";

// Function to check if push notifications are supported
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Request permission for notifications
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications not supported');
  }
  
  return await Notification.requestPermission();
};

// Register service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service worker not supported');
  }
  
  try {
    return await navigator.serviceWorker.register('/sw.js');
  } catch (error) {
    throw new Error(`Service worker registration failed: ${error}`);
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (
  topics: string[] = ['sales', 'restock']
): Promise<PushSubscription | null> => {
  try {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return null;
    }
    
    const registration = await registerServiceWorker();
    
    // Get the subscription if it exists
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Get public VAPID key
      const publicVapidKey = 'BNN2UweLD_mouKENJdsVgOR_Soq0HNG-Wyyr3qKbOJdCTeyhaJ3U6pMX5cAXl0aK2c3Cb765suFiY3G3BiDXXXX';
      
      // Create a new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      
      // Store topics in the subscription
      localStorage.setItem('notification_topics', JSON.stringify(topics));
      
      // Send subscription to backend
      await sendSubscriptionToBackend(subscription, topics);
    }
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Send the subscription to the backend
const sendSubscriptionToBackend = async (
  subscription: PushSubscription, 
  topics: string[]
): Promise<void> => {
  try {
    // This would be your actual API endpoint
    const response = await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        topics,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to store subscription');
    }
  } catch (error) {
    console.error('Error storing subscription:', error);
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Unsubscribe on the client
      const success = await subscription.unsubscribe();
      
      if (success) {
        // Tell the server to remove the subscription
        await fetch('/api/push-unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription: subscription.toJSON(),
          }),
        });
        
        localStorage.removeItem('notification_topics');
      }
      
      return success;
    }
    
    return false;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
};

// Helper function to convert VAPID key from base64 to Uint8Array
// (Required for the applicationServerKey property)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}