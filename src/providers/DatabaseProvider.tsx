import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import NotificationSetup from '../components/NotificationSetup';
import { database } from '../database';
import { notificationService } from '../services/notificationService';

interface DatabaseContextType {
    isReady: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
    isReady: false,
    error: null,
});

export const useDatabaseContext = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
    children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [showNotificationSetup, setShowNotificationSetup] = useState(false);
    const [checkingPermissions, setCheckingPermissions] = useState(true);

    useEffect(() => {
        const initDatabase = async () => {
            try {
                await database.init();

                // Check notification permissions
                const { status } = await Notifications.getPermissionsAsync();

                if (status !== 'granted') {
                    setShowNotificationSetup(true);
                } else {
                    // Ensure channel is configured even if permission already granted
                    await notificationService.requestPermissions();
                }

                setIsReady(true);
                setCheckingPermissions(false);
            } catch (err) {
                console.error('Database initialization failed:', err);
                setError(err instanceof Error ? err : new Error('Unknown database error'));
                setCheckingPermissions(false);
            }
        };

        initDatabase();
    }, []);

    const handleNotificationSetupComplete = () => {
        setShowNotificationSetup(false);
    };

    if (checkingPermissions || !isReady) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (showNotificationSetup) {
        return <NotificationSetup onComplete={handleNotificationSetupComplete} />;
    }

    return (
        <DatabaseContext.Provider value={{ isReady, error }}>
            {children}
        </DatabaseContext.Provider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});
