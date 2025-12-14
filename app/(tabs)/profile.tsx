import NotificationHistory from "@/src/components/NotificationHistory";
import { notificationService } from "@/src/services/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useUserStore } from "../../src/store";

export default function ProfileScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { profile, fetchProfile, isLoading } = useUserStore();
    const [testSent, setTestSent] = useState(false);
    const [showNotificationHistory, setShowNotificationHistory] = useState(false);
    const [showReminderSettings, setShowReminderSettings] = useState(false);
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [reminderTime, setReminderTime] = useState(30); // minutes before

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            i18n.changeLanguage(profile.languagePreference);
        }
    }, [profile]);

    const handleEditProfile = () => {
        router.push("/edit-profile" as any);
    };

    const handleLanguageChange = async () => {
        const newLang = i18n.language === "en" ? "ta" : "en";
        await i18n.changeLanguage(newLang);
        if (profile) {
            const { updateProfile } = useUserStore.getState();
            await updateProfile({ languagePreference: newLang as "en" | "ta" });
        }
    };

    const sendTestNotification = async () => {
        try {
            console.log('Sending test notification from Profile...');
            await notificationService.sendImmediateNotification('Test Medication', '10mg');
            setTestSent(true);
            setTimeout(() => setTestSent(false), 3000);
            Alert.alert(
                t("profile.testNotification") || "Test Sent",
                t("profile.testNotificationMessage") || "Check your notification tray!"
            );
            console.log('Test notification sent successfully!');
        } catch (error) {
            console.error('Failed to send test notification:', error);
            Alert.alert("Error", "Failed to send test notification");
        }
    };

    const handleExportData = async () => {
        try {
            const db = await require('../../src/database').database.getDatabase();
            if (!db) {
                Alert.alert(t('notificationHistory.error'), 'Database not available');
                return;
            }

            // Get all data
            const medicines = await db.getAllAsync('SELECT * FROM medicines');
            const schedules = await db.getAllAsync('SELECT * FROM schedules');
            const notificationLogs = await db.getAllAsync('SELECT * FROM notification_logs');
            const userProfile = await db.getFirstAsync('SELECT * FROM user_profile');

            const exportData = {
                exportDate: new Date().toISOString(),
                profile: userProfile,
                medicines,
                schedules,
                notificationLogs,
            };

            const jsonString = JSON.stringify(exportData, null, 2);

            Alert.alert(
                t('messages.success'),
                `Exported ${medicines.length} medicines, ${schedules.length} schedules, ${notificationLogs.length} notification logs.\n\nData ready to save or share.`,
                [
                    { text: t('common.ok') },
                ]
            );

            console.log('Export data:', jsonString.substring(0, 200) + '...');
        } catch (error) {
            console.error('Export error:', error);
            Alert.alert(t('notificationHistory.error'), 'Failed to export data');
        }
    };

    const handleClearAllData = () => {
        Alert.alert(
            t('messages.confirmDelete'),
            'This will delete all your medications, schedules, and notification history. This action cannot be undone.',
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const db = await require('../../src/database').database.getDatabase();
                            if (!db) return;

                            // Cancel all notifications first
                            await notificationService.cancelAllNotifications();

                            // Delete all data
                            await db.execAsync('DELETE FROM notification_logs');
                            await db.execAsync('DELETE FROM schedules');
                            await db.execAsync('DELETE FROM medicines');
                            await db.execAsync('DELETE FROM medicine_history');
                            await db.execAsync('DELETE FROM appointments');

                            // Refresh stores
                            const { fetchMedicines } = require('../../src/store').useMedicineStore.getState();
                            const { fetchSchedules } = require('../../src/store').useScheduleStore.getState();
                            await fetchMedicines();
                            await fetchSchedules();

                            Alert.alert(
                                t('messages.success'),
                                'All data has been cleared successfully'
                            );
                        } catch (error) {
                            console.error('Clear data error:', error);
                            Alert.alert(t('notificationHistory.error'), 'Failed to clear data');
                        }
                    },
                },
            ]
        );
    };

    if (isLoading && !profile) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={48} color="#007AFF" />
                </View>
                <Text style={styles.name}>{profile?.name || "Guest User"}</Text>
                <Text style={styles.subtitle}>
                    {t("profile.age")}: {profile?.age || "N/A"} • {t(`gender.${profile?.gender || "other"}`)}
                </Text>
                <Pressable style={styles.editButton} onPress={handleEditProfile}>
                    <Ionicons name="create-outline" size={18} color="#007AFF" />
                    <Text style={styles.editButtonText}>{t("profile.editProfile")}</Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t("profile.healthInfo")}</Text>
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Ionicons name="medkit-outline" size={24} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>{t("profile.healthCondition")}</Text>
                            <Text style={styles.infoValue}>{profile?.healthIssue || "Not specified"}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t("profile.settings")}</Text>
                <View style={styles.card}>
                    <Pressable style={styles.settingItem} onPress={handleLanguageChange}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="language-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>{t("profile.language")}</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>{t(`languages.${i18n.language}`)}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem} onPress={() => setShowNotificationHistory(true)}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>{t("profile.notificationHistory")}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem} onPress={sendTestNotification}>
                        <View style={styles.settingLeft}>
                            <Ionicons name={testSent ? "checkmark-circle" : "flash-outline"} size={24} color={testSent ? "#4CAF50" : "#666"} />
                            <Text style={styles.settingText}>
                                {testSent ? "Test Sent!" : "Test Notification"}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem} onPress={() => setShowReminderSettings(true)}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="time-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>{t("profile.reminderSettings")}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t("profile.data")}</Text>
                <View style={styles.card}>
                    <Pressable style={styles.settingItem} onPress={handleExportData}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="download-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>{t("profile.exportData")}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem} onPress={handleClearAllData}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="trash-outline" size={24} color="#F44336" />
                            <Text style={[styles.settingText, { color: "#F44336" }]}>
                                {t("profile.clearAllData")}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>
                </View>
            </View>

            {/* Notification History Modal */}
            <Modal
                visible={showNotificationHistory}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowNotificationHistory(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t("notificationHistory.title")}</Text>
                        <Pressable
                            onPress={() => setShowNotificationHistory(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={28} color="#333" />
                        </Pressable>
                    </View>
                    <NotificationHistory />
                </View>
            </Modal>

            {/* Reminder Settings Modal */}
            <Modal
                visible={showReminderSettings}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowReminderSettings(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.reminderModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Reminder Settings</Text>
                            <Pressable
                                onPress={() => setShowReminderSettings(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={28} color="#333" />
                            </Pressable>
                        </View>

                        <View style={styles.reminderContent}>
                            <View style={styles.reminderOption}>
                                <View style={styles.reminderOptionLeft}>
                                    <Ionicons name="notifications" size={24} color="#007AFF" />
                                    <View style={styles.reminderOptionText}>
                                        <Text style={styles.reminderOptionTitle}>Enable Reminders</Text>
                                        <Text style={styles.reminderOptionSubtitle}>
                                            Receive medication reminders
                                        </Text>
                                    </View>
                                </View>
                                <Pressable
                                    style={[styles.toggle, reminderEnabled && styles.toggleActive]}
                                    onPress={() => setReminderEnabled(!reminderEnabled)}
                                >
                                    <View style={[styles.toggleThumb, reminderEnabled && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.reminderOption}>
                                <View style={styles.reminderOptionLeft}>
                                    <Ionicons name="time" size={24} color="#007AFF" />
                                    <View style={styles.reminderOptionText}>
                                        <Text style={styles.reminderOptionTitle}>Early Reminder</Text>
                                        <Text style={styles.reminderOptionSubtitle}>
                                            {reminderTime} minutes before scheduled time
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.reminderSlider}>
                                <Text style={styles.sliderLabel}>5 min</Text>
                                <View style={styles.sliderTrack}>
                                    {[5, 15, 30, 60].map((val) => (
                                        <Pressable
                                            key={val}
                                            style={[
                                                styles.sliderDot,
                                                reminderTime === val && styles.sliderDotActive,
                                            ]}
                                            onPress={() => setReminderTime(val)}
                                        >
                                            <Text style={[
                                                styles.sliderDotText,
                                                reminderTime === val && styles.sliderDotTextActive
                                            ]}>{val}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                                <Text style={styles.sliderLabel}>60 min</Text>
                            </View>

                            <Pressable
                                style={styles.saveReminderButton}
                                onPress={() => {
                                    Alert.alert('Success', 'Reminder settings saved');
                                    setShowReminderSettings(false);
                                }}
                            >
                                <Text style={styles.saveReminderButtonText}>Save Settings</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    profileHeader: {
        backgroundColor: "#fff",
        alignItems: "center",
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 12,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#007AFF",
        marginTop: 12,
    },
    editButtonText: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "600",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
    },
    infoContent: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    settingItem: {
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
        justifyContent: "space-between",
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
        color: "#333",
    },
    settingRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    settingValue: {
        fontSize: 16,
        color: "#666",
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginLeft: 52,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    reminderModal: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    reminderContent: {
        padding: 20,
    },
    reminderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    reminderOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    reminderOptionText: {
        flex: 1,
    },
    reminderOptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    reminderOptionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    toggle: {
        width: 51,
        height: 31,
        borderRadius: 15.5,
        backgroundColor: '#e0e0e0',
        padding: 2,
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: '#007AFF',
    },
    toggleThumb: {
        width: 27,
        height: 27,
        borderRadius: 13.5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleThumbActive: {
        transform: [{ translateX: 20 }],
    },
    reminderSlider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        marginBottom: 20,
    },
    sliderLabel: {
        fontSize: 12,
        color: '#666',
    },
    sliderTrack: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    sliderDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    sliderDotActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    sliderDotText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    sliderDotTextActive: {
        color: '#fff',
    },
    saveReminderButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveReminderButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
