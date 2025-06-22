"use server";

import webpush from "web-push";

import type { PushSubscription as WebPushSubscription } from "web-push";

webpush.setVapidDetails(
  "mailto:testing@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

let subscription: WebPushSubscription | null = null;

export const subscribeUser = async (sub: WebPushSubscription) => {
  subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })

  return { success: true };
};

export const unsubscribeUser = async () => {
  if (subscription) {
    // In a production environment, you would want to remove the subscription from the database
    // For example: await db.subscriptions.delete({ where: { endpoint: subscription.endpoint } })

    subscription = null;
  }

  return { success: true };
};

export const sendNotification = async (message: string) => {
  if (!subscription) {
    throw new Error("No subscription found");
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/apple-touch-icon.png",
      }),
    );
  } catch (error) {
    console.error("Error sending notification:", error);

    return { success: false, error: "Failed to send notification" };
  }
};
