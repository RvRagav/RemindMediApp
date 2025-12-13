import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { notificationService } from "../services/notificationService";

interface NotificationSetupProps {
    onComplete?: () => void;
}

export default function NotificationSetup({ onComplete }: NotificationSetupProps) {
    const [permissionStatus, setPermissionStatus] = useState<"undetermined" | "granted" | "denied">("undetermined");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionStatus(status === "granted" ? "granted" : status === "denied" ? "denied" : "undetermined");
        setIsLoading(false);
    };

    const requestPermissions = async () => {
        setIsLoading(true);
        const granted = await notificationService.requestPermissions();
        setPermissionStatus(granted ? "granted" : "denied");
        setIsLoading(false);

        if (granted && onComplete) {
            setTimeout(onComplete, 500);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (permissionStatus === "granted") {
        return (
            <View style={styles.container}>
                <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                <Text style={styles.title}>Notifications Enabled!</Text>
                <Text style={styles.subtitle}>
                    You'll receive reminders for your medications
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Ionicons name="notifications-outline" size={80} color="#007AFF" />
            <Text style={styles.title}>Enable Notifications</Text>
            <Text style={styles.subtitle}>
                Get timely reminders to take your medications. We'll send you notifications at the scheduled times.
            </Text>

            <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                    <Ionicons name="alarm-outline" size={24} color="#007AFF" />
                    <Text style={styles.featureText}>Scheduled medication reminders</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="volume-high-outline" size={24} color="#007AFF" />
                    <Text style={styles.featureText}>Sound and vibration alerts</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="time-outline" size={24} color="#007AFF" />
                    <Text style={styles.featureText}>Never miss a dose</Text>
                </View>
            </View>

            <Pressable
                style={styles.enableButton}
                onPress={requestPermissions}
                disabled={isLoading}
            >
                <Text style={styles.enableButtonText}>Enable Notifications</Text>
            </Pressable>

            {permissionStatus === "denied" && (
                <Text style={styles.deniedText}>
                    Please enable notifications in your device settings
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    featuresList: {
        width: "100%",
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 15,
    },
    featureText: {
        fontSize: 16,
        color: "#333",
    },
    enableButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    enableButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    deniedText: {
        marginTop: 20,
        fontSize: 14,
        color: "#FF3B30",
        textAlign: "center",
    },
});
