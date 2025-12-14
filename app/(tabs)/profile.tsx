import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useUserStore } from "../../src/store";
import { notificationService } from "@/src/services/notificationService";

export default function ProfileScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { profile, fetchProfile, isLoading } = useUserStore();
    const [testSent, setTestSent] = useState(false);

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

                    <Pressable style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>{t("profile.notifications")}</Text>
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

                    <Pressable style={styles.settingItem}>
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
                    <Pressable style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="download-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>{t("profile.exportData")}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem}>
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
});
