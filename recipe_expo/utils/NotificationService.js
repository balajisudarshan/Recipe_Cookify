import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const setupNotificationChannel = async () => {
    if (Platform.OS === "android") {
        try {
            await Notifications.setNotificationChannelAsync("default", {
                name: "Default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#EA580C",
            });
            await Notifications.setNotificationChannelAsync("daily-recipe", {
                name: "Daily Recipe",
                description: "Your daily recipe of the day",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 200, 100, 200],
                lightColor: "#EA580C",
            });
        } catch (error) {
            console.log("Error setting notification channel:", error);
        }
    }
};

export const requestPermission = async () => {
    try {
        await setupNotificationChannel();
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        return finalStatus === "granted";
    } catch (error) {
        console.log("Error requesting notification permission:", error);
        return false;
    }
};

// One-time notification (e.g. for testing or triggered events)
export const scheduleNotification = async ({
    title,
    body,
    seconds = 5,
    data = {},
}) => {
    try {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
                ...(Platform.OS === "android" && { channelId: "default" }),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: Math.max(seconds, 1),
                repeats: false,
            },
        });
    } catch (error) {
        console.log("Error scheduling notification:", error);
    }
};

// Daily recipe notification — fires every day at a set hour
// Pass recipeName to personalise the message
export const scheduleDailyRecipeNotification = async (recipeName = null) => {
    try {
        // Cancel any existing daily recipe notifications so we don't stack up duplicates
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        for (const n of scheduled) {
            if (n.content?.data?.type === "daily-recipe") {
                await Notifications.cancelScheduledNotificationAsync(n.identifier);
            }
        }

        const recipeMessages = [
            "What are you cooking today? 🍳",
            "Time to try something delicious! 🌶️",
            "A new recipe is waiting for you 🍜",
            "Cook something amazing today 👨‍🍳",
            "Your daily dose of yum is here 🥘",
        ];

        const fallbackBody = recipeMessages[Math.floor(Math.random() * recipeMessages.length)];

        return await Notifications.scheduleNotificationAsync({
            content: {
                title: recipeName ? `Today's Recipe: ${recipeName} 🍽️` : "Recipe of the Day 🍽️",
                body: recipeName
                    ? `Tap to see how to make ${recipeName} step by step.`
                    : fallbackBody,
                data: { type: "daily-recipe" },
                sound: true,
                ...(Platform.OS === "android" && { channelId: "daily-recipe" }),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: 9,   // 9 AM every day
                minute: 0,
            },
        });
    } catch (error) {
        console.log("Error scheduling daily recipe notification:", error);
    }
};

export const cancelNotification = async (id) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(id);
    } catch (error) {
        console.log("Error canceling notification:", error);
    }
};

export const cancelAllNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
        console.log("Error canceling all notifications:", error);
    }
};