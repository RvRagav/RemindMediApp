import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Good Morning! 👋</Text>
                <Text style={styles.subtitle}>Time to take care of your health</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>Taken Today</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="alarm" size={32} color="#FF9800" />
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>Upcoming</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Reminders</Text>
                <View style={styles.reminderCard}>
                    <View style={styles.reminderTime}>
                        <Text style={styles.timeText}>9:00 AM</Text>
                    </View>
                    <View style={styles.reminderDetails}>
                        <Text style={styles.medicationName}>Aspirin</Text>
                        <Text style={styles.dosage}>100mg - 1 tablet</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#999" />
                </View>
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
});
