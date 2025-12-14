import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { database } from "../src/database";
import { NotificationLogRepository } from "../src/database/repositories";
import "../src/i18n";
import { DatabaseProvider } from "../src/providers";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const { t } = useTranslation();
  const [loaded, error] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Setup notification response listener
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        console.log('Notification tapped:', response);

        const notificationId = response.notification.request.identifier;
        const data = response.notification.request.content.data;

        console.log('Notification data:', data);

        // Show dialog to ask taken/skipped
        Alert.alert(
          data.medicineName || t('notificationHistory.medicationReminder'),
          `${t('notificationHistory.didYouTake')} ${data.medicineName || t('notificationHistory.yourMedication')}?`,
          [
            {
              text: t('notificationHistory.skipped'),
              style: 'cancel',
              onPress: async () => {
                console.log('User marked as skipped');
                await handleNotificationResponse(notificationId, 'skipped', data, t);
              },
            },
            {
              text: t('notificationHistory.taken'),
              onPress: async () => {
                console.log('User marked as taken');
                await handleNotificationResponse(notificationId, 'taken', data, t);
              },
            },
          ],
          { cancelable: false }
        );
      }
    );

    return () => subscription.remove();
  }, [t]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <DatabaseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-medication"
          options={{
            presentation: "modal",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="medication-details"
          options={{
            headerShown: true,
            title: "Medication Details"
          }}
        />
      </Stack>
    </DatabaseProvider>
  );
}

async function handleNotificationResponse(
  notificationId: string,
  status: 'taken' | 'skipped',
  data: any,
  t: any
) {
  try {
    const db = await database.getDatabase();
    if (!db) {
      console.error('Database not initialized');
      return;
    }

    const notificationLogRepo = new NotificationLogRepository(db);

    // Try to find existing log
    const existingLog = await notificationLogRepo.findByNotificationId(notificationId);

    if (existingLog) {
      // Update existing log
      await notificationLogRepo.updateStatus(existingLog.id, status);
      console.log(`Updated notification log ${existingLog.id} with status: ${status}`);
    } else {
      // Create new log if doesn't exist
      if (data.scheduleId && data.medicineId && data.scheduledTime) {
        await notificationLogRepo.create({
          notification_id: notificationId,
          schedule_id: data.scheduleId,
          medicine_id: data.medicineId,
          scheduled_time: data.scheduledTime,
          status: status,
          responded_at: new Date().toISOString(),
        });
        console.log(`Created notification log for ${notificationId} with status: ${status}`);
      } else {
        console.warn('Missing data to create notification log:', data);
      }
    }

    Alert.alert(
      t('notificationHistory.success'),
      `${t('notificationHistory.markedAs')} ${status}`,
      [{ text: t('common.ok') }]
    );
  } catch (error) {
    console.error('Error handling notification response:', error);
    Alert.alert(t('notificationHistory.error'), t('notificationHistory.failedToRecord'));
  }
}
