import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AddMedicationScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#000" />
                </Pressable>
                <Text style={styles.title}>Add Medication</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.placeholder}>
                    <Ionicons name="add-circle-outline" size={80} color="#007AFF" />
                    <Text style={styles.placeholderText}>
                        Medication form will be implemented here
                    </Text>
                    <Text style={styles.placeholderSubtext}>
                        Fields: Name, Dosage, Form, Instructions, Schedule
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Medication</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    content: {
        flex: 1,
    },
    placeholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
        color: "#333",
    },
    placeholderSubtext: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    saveButton: {
        backgroundColor: "#007AFF",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
