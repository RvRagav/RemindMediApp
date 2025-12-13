import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ScheduleScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.date}>Today, December 13</Text>
            </View>

            <View style={styles.timelineContainer}>
                <View style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                        <Text style={styles.timeText}>8:00 AM</Text>
                        <View style={styles.medicationCard}>
                            <Ionicons name="fitness" size={24} color="#4CAF50" />
                            <View style={styles.medicationInfo}>
                                <Text style={styles.medicationName}>Vitamin D</Text>
                                <Text style={styles.medicationDose}>1000 IU - 1 capsule</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, styles.timelineDotPending]} />
                    <View style={styles.timelineContent}>
                        <Text style={styles.timeText}>1:00 PM</Text>
                        <View style={styles.medicationCard}>
                            <Ionicons name="medkit" size={24} color="#FF9800" />
                            <View style={styles.medicationInfo}>
                                <Text style={styles.medicationName}>Aspirin</Text>
                                <Text style={styles.medicationDose}>100mg - 1 tablet</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, styles.timelineDotPending]} />
                    <View style={styles.timelineContent}>
                        <Text style={styles.timeText}>9:00 PM</Text>
                        <View style={styles.medicationCard}>
                            <Ionicons name="water" size={24} color="#2196F3" />
                            <View style={styles.medicationInfo}>
                                <Text style={styles.medicationName}>Calcium</Text>
                                <Text style={styles.medicationDose}>500mg - 2 tablets</Text>
                            </View>
                        </View>
                    </View>
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
    header: {
        padding: 20,
        backgroundColor: "#fff",
    },
    date: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
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
        backgroundColor: "#4CAF50",
        marginTop: 6,
        marginRight: 16,
    },
    timelineDotPending: {
        backgroundColor: "#FF9800",
    },
    timelineContent: {
        flex: 1,
    },
    timeText: {
        fontSize: 14,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    medicationInfo: {
        marginLeft: 12,
        flex: 1,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
        color: "#333",
    },
    medicationDose: {
        fontSize: 14,
        color: "#666",
    },
});
