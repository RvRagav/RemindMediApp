import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={48} color="#007AFF" />
                </View>
                <Text style={styles.name}>John Doe</Text>
                <Text style={styles.subtitle}>Age: 45 • Male</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Health Information</Text>
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Ionicons name="medkit-outline" size={24} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Health Condition</Text>
                            <Text style={styles.infoValue}>Hypertension, Diabetes</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.card}>
                    <Pressable style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="language-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>Language</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>English</Text>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="time-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>Reminder Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data</Text>
                <View style={styles.card}>
                    <Pressable style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="download-outline" size={24} color="#666" />
                            <Text style={styles.settingText}>Export Data</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="trash-outline" size={24} color="#F44336" />
                            <Text style={[styles.settingText, { color: "#F44336" }]}>
                                Clear All Data
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
