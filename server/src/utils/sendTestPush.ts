import webpush from "../config/webpush"; // the file where you set VAPID keys
import UserPushSubscription from "../models/user_push_subscriptions";

export const sendTestPush = async () => {
  const subscriptions = await UserPushSubscription.findAll();

  const payload = JSON.stringify({
    title: "Test Push",
    body: "This is a test notification",
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys_p256dh,
            auth: sub.keys_auth,
          },
        },
        payload
      );
    } catch (err) {
      console.error("Push failed for endpoint:", sub.endpoint, err);
    }
  }
};
