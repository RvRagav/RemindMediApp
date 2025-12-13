import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const iconColor = colorScheme === "dark" ? "#fff" : "#000";
    const activeColor = "#007AFF";

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: iconColor,
                headerShown: true,
                tabBarStyle: {
                    backgroundColor: colorScheme === "dark" ? "#1c1c1e" : "#fff",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t("tabs.home"),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="medications"
                options={{
                    title: t("tabs.medications"),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "medical" : "medical-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="schedule"
                options={{
                    title: t("tabs.schedule"),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "calendar" : "calendar-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t("tabs.profile"),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
