import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { database } from "../database";
import { NotificationLogRepository, NotificationLogWithDetails } from "../database/repositories";

export default function NotificationHistory() {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<NotificationLogWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'taken' | 'skipped'>('pending');

    const fetchLogs = useCallback(async () => {
        try {
            const db = await database.getDatabase();
            if (!db) return;

            const repo = new NotificationLogRepository(db);

            let fetchedLogs: NotificationLogWithDetails[];
            if (filter === 'pending') {
                fetchedLogs = await repo.getPendingLogs();
            } else {
                const allLogs = await repo.getRecentLogs(100);
                if (filter === 'all') {
                    fetchedLogs = allLogs;
                } else {
                    fetchedLogs = allLogs.filter(log => log.status === filter);
                }
            }

            setLogs(fetchedLogs);
        } catch (error) {
            console.error('Error fetching notification logs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLogs();
    };

    const handleLogPress = (item: NotificationLogWithDetails) => {
        // Only allow action if the log is pending
        if (item.status !== 'pending') {
            return;
        }

        Alert.alert(
            item.medicine_name,
            `${t('notificationHistory.didYouTake')} ${item.medicine_name}?`,
            [
                {
                    text: t('notificationHistory.skipped'),
                    style: 'cancel',
                    onPress: async () => {
                        await updateLogStatus(item.id, 'skipped');
                    },
                },
                {
                    text: t('notificationHistory.taken'),
                    onPress: async () => {
                        await updateLogStatus(item.id, 'taken');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const updateLogStatus = async (logId: number, status: 'taken' | 'skipped') => {
        try {
            const db = await database.getDatabase();
            if (!db) {
                console.error('Database not initialized');
                return;
            }

            const repo = new NotificationLogRepository(db);
            await repo.updateStatus(logId, status);

            Alert.alert(
                t('notificationHistory.success'),
                `${t('notificationHistory.markedAs')} ${status}`,
                [{ text: t('common.ok') }]
            );

            // Refresh the list
            fetchLogs();
        } catch (error) {
            console.error('Error updating notification log:', error);
            Alert.alert(t('notificationHistory.error'), t('notificationHistory.failedToRecord'));
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'taken':
                return '#4CAF50';
            case 'skipped':
                return '#FF9800';
            case 'pending':
                return '#2196F3';
            default:
                return '#999';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'taken':
                return 'checkmark-circle';
            case 'skipped':
                return 'close-circle';
            case 'pending':
                return 'time';
            default:
                return 'help-circle';
        }
    };

    const renderItem = ({ item }: { item: NotificationLogWithDetails }) => (
        <Pressable
            style={styles.logItem}
            onPress={() => handleLogPress(item)}
            disabled={item.status !== 'pending'}
        >
            <View style={styles.logHeader}>
                <View style={styles.medicineInfo}>
                    <Text style={styles.medicineName}>{item.medicine_name}</Text>
                    <Text style={styles.medicineDosage}>
                        {item.medicine_dosage} • {item.medicine_form}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Ionicons
                        name={getStatusIcon(item.status) as any}
                        size={16}
                        color="#fff"
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.logDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.detailText}>
                        {t('notificationHistory.scheduled')}: {formatDateTime(item.scheduled_time)}
                    </Text>
                </View>

                {item.responded_at && (
                    <View style={styles.detailRow}>
                        <Ionicons name="checkmark-done-outline" size={14} color="#666" />
                        <Text style={styles.detailText}>
                            {t('notificationHistory.responded')}: {formatDateTime(item.responded_at)}
                        </Text>
                    </View>
                )}
            </View>

            {item.status === 'pending' && (
                <View style={styles.tapHint}>
                    <Ionicons name="hand-left-outline" size={14} color="#007AFF" />
                    <Text style={styles.tapHintText}>{t('notificationHistory.tapToRespond')}</Text>
                </View>
            )}
        </Pressable>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
                {filter === 'pending'
                    ? t('notificationHistory.noPending')
                    : filter === 'taken'
                        ? t('notificationHistory.noTaken')
                        : filter === 'skipped'
                            ? t('notificationHistory.noSkipped')
                            : t('notificationHistory.noAll')}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {(['pending', 'all', 'taken', 'skipped'] as const).map((filterOption) => (
                    <Pressable
                        key={filterOption}
                        style={[
                            styles.filterTab,
                            filter === filterOption && styles.filterTabActive,
                        ]}
                        onPress={() => setFilter(filterOption)}
                    >
                        <Text
                            style={[
                                styles.filterTabText,
                                filter === filterOption && styles.filterTabTextActive,
                            ]}
                        >
                            {t(`notificationHistory.${filterOption}`)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={logs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterTab: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderRadius: 6,
        marginHorizontal: 2,
    },
    filterTabActive: {
        backgroundColor: '#007AFF',
    },
    filterTabText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    filterTabTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    logItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    medicineInfo: {
        flex: 1,
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    medicineDosage: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    logDetails: {
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    tapHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    tapHintText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
});
