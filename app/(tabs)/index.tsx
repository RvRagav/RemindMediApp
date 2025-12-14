import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { database } from "../../src/database";
import { NotificationLogRepository } from "../../src/database/repositories";
import { useMedicineStore, useScheduleStore, useUserStore } from "../../src/store";

export default function HomeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { profile, fetchProfile } = useUserStore();
    const { medicines, fetchMedicines, isLoading } = useMedicineStore();
    const { schedules, fetchSchedules } = useScheduleStore();
    const [takenCount, setTakenCount] = useState(0);
    const [totalToday, setTotalToday] = useState(0);

    useEffect(() => {
        fetchProfile();
        fetchMedicines();
        fetchSchedules();
        loadTodayStats();
    }, []);

    const loadTodayStats = async () => {
        try {
            const db = await database.getDatabase();
            if (!db) return;

            const repo = new NotificationLogRepository(db);
            const today = new Date().toISOString().split('T')[0];

            // Get all logs from today
            const allLogs = await repo.getRecentLogs(100);
            const todayLogs = allLogs.filter(log =>
                log.scheduled_time.startsWith(today)
            );

            const taken = todayLogs.filter(log => log.status === 'taken').length;
            const total = todayLogs.length;

            setTakenCount(taken);
            setTotalToday(total);
        } catch (error) {
            console.error('Error loading today stats:', error);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t("home.goodMorning");
        if (hour < 18) return t("home.goodAfternoon");
        return t("home.goodEvening");
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
                <Text style={styles.subtitle}>
                    {profile ? `${profile.name}, ${t("home.subtitle")}` : t("home.subtitle")}
                </Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                    <Text style={styles.statNumber}>{takenCount}/{totalToday}</Text>
                    <Text style={styles.statLabel}>{t("home.takenToday")}</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="medical" size={32} color="#007AFF" />
                    <Text style={styles.statNumber}>{medicines.length}</Text>
                    <Text style={styles.statLabel}>{t("home.medications")}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t("home.yourMedications")}</Text>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
                ) : medicines.length > 0 ? (
                    medicines.slice(0, 3).map((medicine) => (
                        <View key={medicine.id} style={styles.reminderCard}>
                            <View style={[styles.reminderTime, { backgroundColor: medicine.color || "#E3F2FD" }]}>
                                <Ionicons name="medical" size={20} color="#1976D2" />
                            </View>
                            <View style={styles.reminderDetails}>
                                <Text style={styles.medicationName}>{medicine.name}</Text>
                                <Text style={styles.dosage}>{medicine.dosage} - {medicine.form}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No medications added yet</Text>
                    </View>
                )}
            </View>

            <Pressable
                style={styles.addButton}
                onPress={() => router.push("/add-medication" as any)}
            >
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Add Medication</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 20,
        backgroundColor: "#fff",
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
    statsContainer: {
        flexDirection: "row",
        padding: 20,
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 8,
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    reminderCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reminderTime: {
        backgroundColor: "#E3F2FD",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 12,
    },
    timeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1976D2",
    },
    reminderDetails: {
        flex: 1,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    dosage: {
        fontSize: 14,
        color: "#666",
    },
    addButton: {
        flexDirection: "row",
        backgroundColor: "#007AFF",
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    emptyState: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
    },
});
