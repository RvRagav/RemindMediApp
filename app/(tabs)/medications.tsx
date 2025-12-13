import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function MedicationsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.emptyState}>
                    <Ionicons name="medical-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyTitle}>No Medications Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Add your first medication to get started
                    </Text>
                </View>
            </ScrollView>

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
