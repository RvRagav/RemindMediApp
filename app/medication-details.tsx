import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function MedicationDetailsScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Ionicons name="medical" size={48} color="#007AFF" />
                </View>
                <Text style={styles.medicationName}>Aspirin</Text>
                <Text style={styles.dosage}>100mg - 1 tablet</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                <View style={styles.card}>
                    <Text style={styles.instructions}>
                        Take with food. Avoid taking on an empty stomach.
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Schedule</Text>
                <View style={styles.card}>
                    <View style={styles.scheduleItem}>
                        <Ionicons name="time-outline" size={24} color="#666" />
                        <View style={styles.scheduleInfo}>
                            <Text style={styles.scheduleText}>Daily at 9:00 AM</Text>
                            <Text style={styles.scheduleSubtext}>Every day</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>History</Text>
                <View style={styles.card}>
                    <View style={styles.historyItem}>
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        <View style={styles.historyInfo}>
                            <Text style={styles.historyText}>Taken</Text>
                            <Text style={styles.historyDate}>Today at 9:05 AM</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.historyItem}>
                        <Ionicons name="close-circle" size={24} color="#F44336" />
                        <View style={styles.historyInfo}>
                            <Text style={styles.historyText}>Skipped</Text>
                            <Text style={styles.historyDate}>Yesterday at 9:00 AM</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button, styles.editButton]}>
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                    <Text style={[styles.buttonText, { color: "#007AFF" }]}>Edit</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.deleteButton]}>
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                    <Text style={[styles.buttonText, { color: "#F44336" }]}>Delete</Text>
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
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: 20,
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 16,
    },
    medicationName: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
        color: "#333",
    },
    dosage: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    section: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 20,
        marginBottom: -8,
        color: "#333",
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
    },
    scheduleItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    scheduleInfo: {
        marginLeft: 12,
        flex: 1,
    },
    scheduleText: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
        color: "#333",
    },
    scheduleSubtext: {
        fontSize: 14,
        color: "#666",
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    historyInfo: {
        marginLeft: 12,
        flex: 1,
    },
    historyText: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
        color: "#333",
    },
    historyDate: {
        fontSize: 14,
        color: "#666",
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 12,
    },
    buttonContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: "row",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1,
    },
    editButton: {
        backgroundColor: "#E3F2FD",
        borderColor: "#007AFF",
    },
    deleteButton: {
        backgroundColor: "#FFEBEE",
        borderColor: "#F44336",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
