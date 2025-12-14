import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface ScheduleNotificationParams {
    scheduleId?: number; // Optional for when creating schedule
    medicineId: number;
    medicineName: string;
    dosage: string;
    time: string; // HH:mm format
    recurrence: 'daily' | 'weekly' | 'monthly' | 'custom' | 'as-needed';
    recurrenceDays?: number[]; // For weekly recurrence
    startDate: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
}

class NotificationService {
    async requestPermissions(): Promise<boolean> {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return false;
        }

        // Configure notification channel for Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('medication-reminders', {
                name: 'Medication Reminders',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default',
                enableVibrate: true,
            });
        }

        return true;
    }

    async scheduleNotification(params: ScheduleNotificationParams): Promise<string | null> {
        console.log('📅 scheduleNotification called with:', {
            medicineName: params.medicineName,
            time: params.time,
            recurrence: params.recurrence,
            recurrenceDays: params.recurrenceDays,
        });

        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
            console.log('❌ Notification permission not granted');
            return null;
        }

        const [hours, minutes] = params.time.split(':').map(Number);

        // Calculate seconds until next occurrence
        const now = new Date();
        const nextOccurrence = new Date();
        nextOccurrence.setHours(hours, minutes, 0, 0);

        // If the time has already passed today, schedule for tomorrow
        if (nextOccurrence <= now) {
            nextOccurrence.setDate(nextOccurrence.getDate() + 1);
        }

        const secondsUntilNotification = Math.floor((nextOccurrence.getTime() - now.getTime()) / 1000);
        console.log('⏰ Scheduling details:', {
            currentTime: now.toLocaleTimeString(),
            nextOccurrence: nextOccurrence.toLocaleString(),
            secondsUntilNotification,
            actualSeconds: Math.max(60, secondsUntilNotification),
        });

        let trigger: Notifications.NotificationTriggerInput;
        const ONE_DAY_SECONDS = 86400; // 24 hours
        const ONE_WEEK_SECONDS = 604800; // 7 days

        if (params.recurrence === 'daily') {
            // For daily: schedule to first occurrence, then repeat every 24 hours
            // Android timeInterval repeats at the SAME interval, so we use 24 hours
            const firstTriggerSeconds = Math.max(60, secondsUntilNotification);

            // Schedule first notification
            const firstId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💊 Medication Reminder',
                    body: `Time to take ${params.medicineName} (${params.dosage})`,
                    data: {
                        scheduleId: params.scheduleId,
                        medicineId: params.medicineId,
                        medicineName: params.medicineName,
                        dosage: params.dosage,
                        scheduledTime: nextOccurrence.toISOString(),
                    },
                    sound: 'default',
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    ios: { sound: true },
                } as any,
                trigger: {
                    type: 'timeInterval',
                    seconds: firstTriggerSeconds,
                    repeats: false,
                } as Notifications.TimeIntervalTriggerInput,
            });

            // Calculate next repeat time
            const nextRepeatTime = new Date(nextOccurrence);
            nextRepeatTime.setDate(nextRepeatTime.getDate() + 1);

            // Schedule repeating daily notification (starts after first one)
            const repeatId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💊 Medication Reminder',
                    body: `Time to take ${params.medicineName} (${params.dosage})`,
                    data: {
                        scheduleId: params.scheduleId,
                        medicineId: params.medicineId,
                        medicineName: params.medicineName,
                        dosage: params.dosage,
                        scheduledTime: nextRepeatTime.toISOString(),
                    },
                    sound: 'default',
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    ios: { sound: true },
                } as any,
                trigger: {
                    type: 'timeInterval',
                    seconds: firstTriggerSeconds + ONE_DAY_SECONDS,
                    repeats: true,
                } as Notifications.TimeIntervalTriggerInput,
            });

            console.log('📆 Daily notifications created:', {
                firstId,
                repeatId,
                firstTriggerSeconds,
                repeatInterval: ONE_DAY_SECONDS,
            });

            return `${firstId},${repeatId}`;
        } else if (params.recurrence === 'weekly' && params.recurrenceDays && params.recurrenceDays.length > 0) {
            // Schedule for specific days of the week
            const notificationIds: string[] = [];

            for (const weekday of params.recurrenceDays) {
                // Calculate next occurrence for this weekday
                const nextWeekday = new Date();
                const currentDay = nextWeekday.getDay();
                let daysToAdd = weekday - currentDay;

                if (daysToAdd <= 0) {
                    daysToAdd += 7;
                }

                nextWeekday.setDate(nextWeekday.getDate() + daysToAdd);
                nextWeekday.setHours(hours, minutes, 0, 0);

                const secondsUntil = Math.floor((nextWeekday.getTime() - now.getTime()) / 1000);
                console.log(`📅 Weekly schedule for ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][weekday]}:`, {
                    nextWeekday: nextWeekday.toLocaleString(),
                    secondsUntil,
                    actualSeconds: Math.max(60, secondsUntil),
                });

                // First notification
                const firstId = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: '💊 Medication Reminder',
                        body: `Time to take ${params.medicineName} (${params.dosage})`,
                        data: {
                            scheduleId: params.scheduleId,
                            medicineId: params.medicineId,
                            medicineName: params.medicineName,
                            dosage: params.dosage,
                            scheduledTime: nextWeekday.toISOString(),
                        },
                        sound: 'default',
                        priority: Notifications.AndroidNotificationPriority.MAX,
                        ios: { sound: true },
                    } as any,
                    trigger: {
                        type: 'timeInterval',
                        seconds: Math.max(60, secondsUntil),
                        repeats: false,
                    } as Notifications.TimeIntervalTriggerInput,
                });

                // Calculate next repeat time
                const nextRepeatWeekday = new Date(nextWeekday);
                nextRepeatWeekday.setDate(nextRepeatWeekday.getDate() + 7);

                // Repeating weekly notification
                const repeatId = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: '💊 Medication Reminder',
                        body: `Time to take ${params.medicineName} (${params.dosage})`,
                        data: {
                            scheduleId: params.scheduleId,
                            medicineId: params.medicineId,
                            medicineName: params.medicineName,
                            dosage: params.dosage,
                            scheduledTime: nextRepeatWeekday.toISOString(),
                        },
                        sound: 'default',
                        priority: Notifications.AndroidNotificationPriority.MAX,
                        ios: { sound: true },
                    } as any,
                    trigger: {
                        type: 'timeInterval',
                        seconds: Math.max(60, secondsUntil) + ONE_WEEK_SECONDS,
                        repeats: true,
                    } as Notifications.TimeIntervalTriggerInput,
                });

                notificationIds.push(firstId);
                notificationIds.push(repeatId);
            }

            // Return comma-separated IDs for storage
            const joinedIds = notificationIds.join(',');
            console.log('✅ Weekly notifications scheduled! IDs:', joinedIds);
            return joinedIds;
        } else if (params.recurrence === 'as-needed') {
            // Don't schedule automatic notifications for as-needed medications
            return null;
        } else {
            // Default to daily for other recurrence types (monthly, custom)
            const firstTriggerSeconds = Math.max(60, secondsUntilNotification);

            const firstId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💊 Medication Reminder',
                    body: `Time to take ${params.medicineName} (${params.dosage})`,
                    data: {
                        medicineId: params.medicineId,
                        medicineName: params.medicineName,
                        dosage: params.dosage,
                    },
                    sound: 'default',
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    ios: { sound: true },
                } as any,
                trigger: {
                    type: 'timeInterval',
                    seconds: firstTriggerSeconds,
                    repeats: false,
                } as Notifications.TimeIntervalTriggerInput,
            });

            const repeatId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💊 Medication Reminder',
                    body: `Time to take ${params.medicineName} (${params.dosage})`,
                    data: {
                        medicineId: params.medicineId,
                        medicineName: params.medicineName,
                        dosage: params.dosage,
                    },
                    sound: 'default',
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    ios: { sound: true },
                } as any,
                trigger: {
                    type: 'timeInterval',
                    seconds: firstTriggerSeconds + ONE_DAY_SECONDS,
                    repeats: true,
                } as Notifications.TimeIntervalTriggerInput,
            });

            console.log('📆 Default daily notifications created:', { firstId, repeatId });
            return `${firstId},${repeatId}`;
        }
    }

    async cancelNotification(notificationId: string): Promise<void> {
        if (!notificationId) return;

        // Handle comma-separated IDs (for weekly schedules)
        if (notificationId.includes(',')) {
            const ids = notificationId.split(',');
            for (const id of ids) {
                await Notifications.cancelScheduledNotificationAsync(id.trim());
            }
        } else {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        }
    }

    async cancelAllNotifications(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    async getAllScheduledNotifications() {
        return await Notifications.getAllScheduledNotificationsAsync();
    }

    // Immediate notification (for testing or manual reminders)
    async sendImmediateNotification(medicineName: string, dosage: string): Promise<void> {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '💊 Medication Reminder',
                body: `Time to take ${medicineName} (${dosage})`,
                data: { medicineName, dosage },
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                ios: { sound: true },
            } as any,
            trigger: null, // null means send immediately
        });
    }

    // Add notification response handler
    addNotificationResponseListener(callback: (response: Notifications.NotificationResponse) => void) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }

    // Add notification received listener (when notification arrives while app is open)
    addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
        return Notifications.addNotificationReceivedListener(callback);
    }
}

export const notificationService = new NotificationService();
