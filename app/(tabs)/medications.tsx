import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMedicineStore } from "../../src/store";

export default function MedicationsScreen() {
    const router = useRouter();
    const { medicines, fetchMedicines, isLoading } = useMedicineStore();

    useEffect(() => {
        fetchMedicines();
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {medicines.length === 0 ? (
                <ScrollView style={styles.content}>
                    <View style={styles.emptyState}>
                        <Ionicons name="medical-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyTitle}>No Medications Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Add your first medication to get started
                        </Text>
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    data={medicines}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.medicineCard}
                            onPress={() => router.push(`/medication-details?id=${item.id}` as any)}
                        >
                            <View style={[styles.medicineIcon, { backgroundColor: item.color || "#E3F2FD" }]}>
                                <Ionicons name="medical" size={24} color="#1976D2" />
                            </View>
                            <View style={styles.medicineInfo}>
                                <Text style={styles.medicineName}>{item.name}</Text>
                                <Text style={styles.medicineDosage}>{item.dosage} - {item.form}</Text>
                                {item.instructions && (
                                    <Text style={styles.medicineInstructions} numberOfLines={1}>
                                        {item.instructions}
                                    </Text>
                                )}
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </Pressable>
                    )}
                />
            )}

            <Pressable
                style={styles.fab}
                onPress={() => router.push("/add-medication" as any)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    medicineCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    medicineIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    medicineInfo: {
        flex: 1,
    },
    medicineName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
        color: "#333",
    },
    medicineDosage: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    medicineInstructions: {
        fontSize: 12,
        color: "#999",
        fontStyle: "italic",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
        color: "#333",
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});
