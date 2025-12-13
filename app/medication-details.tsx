import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMedicineStore, useScheduleStore } from "../src/store";

export default function MedicationDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { selectedMedicine, fetchMedicineById, deleteMedicine, isLoading } = useMedicineStore();
    const { schedules, fetchSchedules } = useScheduleStore();
    const [medicineSchedules, setMedicineSchedules] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            fetchMedicineById(Number(id));
            fetchSchedules();
        }
    }, [id]);

    useEffect(() => {
        if (selectedMedicine && schedules.length > 0) {
            const filtered = schedules.filter(s => s.medicineId === selectedMedicine.id);
            setMedicineSchedules(filtered);
        }
    }, [selectedMedicine, schedules]);

    const handleDelete = () => {
        Alert.alert(
            "Delete Medication",
            `Are you sure you want to delete ${selectedMedicine?.name}? This will also delete all associated schedules.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (selectedMedicine) {
                            await deleteMedicine(selectedMedicine.id);
                            Alert.alert("Success", "Medication deleted successfully");
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    const handleEdit = () => {
        router.push(`/edit-medication?id=${id}` as any);
    };

    if (isLoading || !selectedMedicine) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Card */}
            <View style={[styles.headerCard, { backgroundColor: selectedMedicine.color || "#E3F2FD" }]}>
                <Ionicons name="medical" size={60} color="#1976D2" />
                <Text style={styles.medicineName}>{selectedMedicine.name}</Text>
                <Text style={styles.dosage}>{selectedMedicine.dosage}</Text>
            </View>

            {/* Details Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Form:</Text>
                    <Text style={styles.detailValue}>{selectedMedicine.form}</Text>
                </View>
                {selectedMedicine.instructions && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Instructions:</Text>
                        <Text style={styles.detailValue}>{selectedMedicine.instructions}</Text>
                    </View>
                )}
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, selectedMedicine.active ? styles.active : styles.inactive]}>
                        {selectedMedicine.active ? "Active" : "Inactive"}
                    </Text>
                </View>
            </View>

            {/* Schedules Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Schedules ({medicineSchedules.length})</Text>
                    <Pressable
                        style={styles.addScheduleBtn}
                        onPress={() => router.push(`/add-schedule?medicineId=${id}` as any)}
                    >
                        <Ionicons name="add-circle" size={24} color="#007AFF" />
                    </Pressable>
                </View>
                {medicineSchedules.length === 0 ? (
                    <Text style={styles.emptyText}>No schedules set for this medication</Text>
                ) : (
                    medicineSchedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleCard}>
                            <View style={styles.scheduleInfo}>
                                <Ionicons name="time-outline" size={20} color="#666" />
                                <Text style={styles.scheduleTime}>{schedule.time}</Text>
                                <Text style={styles.scheduleRecurrence}>{schedule.recurrence}</Text>
                            </View>
                            <Pressable onPress={() => router.push(`/edit-schedule?id=${schedule.id}` as any)}>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </Pressable>
                        </View>
                    ))
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
                <Pressable style={[styles.actionBtn, styles.editBtn]} onPress={handleEdit}>
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Edit</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Delete</Text>
                </Pressable>
            </View>
        </ScrollView>
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
    headerCard: {
        padding: 30,
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    medicineName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1976D2",
        marginTop: 15,
    },
    dosage: {
        fontSize: 18,
        color: "#424242",
        marginTop: 5,
    },
    section: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 20,
        borderRadius: 15,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    detailLabel: {
        fontSize: 15,
        color: "#666",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 15,
        color: "#333",
        flex: 1,
        textAlign: "right",
    },
    active: {
        color: "#4CAF50",
        fontWeight: "600",
    },
    inactive: {
        color: "#999",
    },
    addScheduleBtn: {
        padding: 5,
    },
    emptyText: {
        textAlign: "center",
        color: "#999",
        fontSize: 14,
        paddingVertical: 20,
    },
    scheduleCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        marginBottom: 10,
    },
    scheduleInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    scheduleTime: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    scheduleRecurrence: {
        fontSize: 14,
        color: "#666",
        textTransform: "capitalize",
    },
    actionContainer: {
        flexDirection: "row",
        gap: 15,
        padding: 15,
        marginBottom: 30,
    },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
        borderRadius: 10,
        gap: 8,
    },
    editBtn: {
        backgroundColor: "#007AFF",
    },
    deleteBtn: {
        backgroundColor: "#FF3B30",
    },
    actionBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
