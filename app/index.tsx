import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useUserStore } from "../src/store";

export default function Index() {
  const { profile, fetchProfile, isLoading } = useUserStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await fetchProfile();
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show a simple splash/loading while we check for an existing profile
  if (!initialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If no profile exists yet, force user into profile setup first
  if (!profile) {
    return <Redirect href="/edit-profile" />;
  }

  // Once a profile exists, go to the main tabs
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
