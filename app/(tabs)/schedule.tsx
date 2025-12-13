import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useScheduleStore } from "../../src/store";

export default function ScheduleScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { todaySchedules, fetchTodaySchedules, isLoading } = useScheduleStore();

    useEffect(() => {
        fetchTodaySchedules();
    }, []);

    const getTodayDate = () => {
        const today = new Date();
        return today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.date}>{t("schedule.today")}, {getTodayDate()}</Text>
                <Pressable style={styles.addButton} onPress={() => router.push("/add-schedule" as any)}>
                    <Ionicons name="add-circle" size={28} color="#007AFF" />
                </Pressable>
            </View>

            <ScrollView style={styles.scrollView}>
                {todaySchedules.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyTitle}>{t("schedule.noSchedules")}</Text>
                        <Text style={styles.emptySubtitle}>{t("schedule.addFirst")}</Text>
                        <Pressable style={styles.emptyButton} onPress={() => router.push("/add-schedule" as any)}>
                            <Ionicons name="add-circle-outline" size={20} color="#fff" />
                            <Text style={styles.emptyButtonText}>{t("schedule.addSchedule")}</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.timelineContainer}>
                        {todaySchedules.map((schedule) => (
                            <Pressable
                                key={schedule.id}
                                style={styles.timelineItem}
                                onPress={() => router.push(`/edit-schedule?id=${schedule.id}` as any)}
                            >
                                <View
                                    style={[
                                        styles.timelineDot,
                                        schedule.active ? styles.timelineDotActive : styles.timelineDotInactive,
                                    ]}
                                />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timeText}>{schedule.time}</Text>
                                    <View style={styles.medicationCard}>
                                        <View
                                            style={[
                                                styles.medicationIcon,
                                                { backgroundColor: schedule.medicine?.color || "#E3F2FD" },
                                            ]}
                                        >
                                            <Ionicons name="medical" size={24} color="#1976D2" />
                                        </View>
                                        <View style={styles.medicationInfo}>
                                            <Text style={styles.medicationName}>{schedule.medicine?.name || "Unknown"}</Text>
                                            <Text style={styles.medicationDose}>
                                                {schedule.medicine?.dosage} - {schedule.medicine?.form}
                                            </Text>
                                            <Text style={styles.recurrenceText}>{schedule.recurrence}</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#999" />
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    date: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    addButton: {
        padding: 5,
    },
    scrollView: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 100,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#666",
        marginTop: 8,
        marginBottom: 30,
        textAlign: "center",
    },
    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    emptyButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    timelineContainer: {
        padding: 20,
    },
    timelineItem: {
        flexDirection: "row",
        marginBottom: 24,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
        marginRight: 16,
    },
    timelineDotActive: {
        backgroundColor: "#4CAF50",
    },
    timelineDotInactive: {
        backgroundColor: "#999",
    },
    timelineContent: {
        flex: 1,
    },
    timeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 8,
    },
    medicationCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    medicationIcon: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    medicationInfo: {
        flex: 1,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    medicationDose: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    recurrenceText: {
        fontSize: 12,
        color: "#999",
        textTransform: "capitalize",
    },
});