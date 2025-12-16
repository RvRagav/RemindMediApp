import * as SQLite from 'expo-sqlite';

export interface NotificationLog {
    id: number;
    notification_id: string;
    schedule_id: number;
    medicine_id: number;
    scheduled_time: string;
    fired_at: string;
    responded_at?: string;
    status: 'pending' | 'taken' | 'skipped';
    created_at: string;
}

export interface NotificationLogWithDetails extends NotificationLog {
    medicine_name: string;
    medicine_dosage: string;
    medicine_form: string;
}

export class NotificationLogRepository {
    private db: SQLite.SQLiteDatabase;

    constructor(database: SQLite.SQLiteDatabase) {
        this.db = database;
    }

    async create(log: Omit<NotificationLog, 'id' | 'created_at' | 'fired_at'>): Promise<NotificationLog> {
        try {
            const result = await this.db.runAsync(
                `INSERT INTO notification_logs 
        (notification_id, schedule_id, medicine_id, scheduled_time, status) 
        VALUES (?, ?, ?, ?, ?)`,
                [log.notification_id, log.schedule_id, log.medicine_id, log.scheduled_time, log.status]
            );

            const insertedLog = await this.db.getFirstAsync<NotificationLog>(
                'SELECT * FROM notification_logs WHERE id = ?',
                [result.lastInsertRowId]
            );

            if (!insertedLog) {
                throw new Error('Failed to retrieve inserted notification log');
            }

            return insertedLog;
        } catch (error) {
            console.error('Error creating notification log:', error);
            throw error;
        }
    }

    async updateStatus(
        id: number,
        status: 'taken' | 'skipped'
    ): Promise<void> {
        try {
            await this.db.runAsync(
                `UPDATE notification_logs 
        SET status = ?, responded_at = datetime('now') 
        WHERE id = ?`,
                [status, id]
            );
        } catch (error) {
            console.error('Error updating notification log status:', error);
            throw error;
        }
    }

    async getPendingLogs(): Promise<NotificationLogWithDetails[]> {
        try {
            const logs = await this.db.getAllAsync<NotificationLogWithDetails>(
                `SELECT 
          nl.*,
          m.name as medicine_name,
          m.dosage as medicine_dosage,
          m.form as medicine_form
        FROM notification_logs nl
        JOIN medicines m ON nl.medicine_id = m.id
        WHERE nl.status = 'pending'
        ORDER BY nl.scheduled_time DESC
        LIMIT 50`
            );
            return logs;
        } catch (error) {
            console.error('Error getting pending notification logs:', error);
            throw error;
        }
    }

    async getLogsByScheduleId(scheduleId: number): Promise<NotificationLogWithDetails[]> {
        try {
            const logs = await this.db.getAllAsync<NotificationLogWithDetails>(
                `SELECT 
          nl.*,
          m.name as medicine_name,
          m.dosage as medicine_dosage,
          m.form as medicine_form
        FROM notification_logs nl
        JOIN medicines m ON nl.medicine_id = m.id
        WHERE nl.schedule_id = ?
        ORDER BY nl.scheduled_time DESC
        LIMIT 100`,
                [scheduleId]
            );
            return logs;
        } catch (error) {
            console.error('Error getting notification logs by schedule:', error);
            throw error;
        }
    }

    async getLogsByMedicineId(medicineId: number): Promise<NotificationLogWithDetails[]> {
        try {
            const logs = await this.db.getAllAsync<NotificationLogWithDetails>(
                `SELECT 
          nl.*,
          m.name as medicine_name,
          m.dosage as medicine_dosage,
          m.form as medicine_form
        FROM notification_logs nl
        JOIN medicines m ON nl.medicine_id = m.id
        WHERE nl.medicine_id = ?
        ORDER BY nl.scheduled_time DESC
        LIMIT 100`,
                [medicineId]
            );
            return logs;
        } catch (error) {
            console.error('Error getting notification logs by medicine:', error);
            throw error;
        }
    }

    async getRecentLogs(limit: number = 50): Promise<NotificationLogWithDetails[]> {
        try {
            const logs = await this.db.getAllAsync<NotificationLogWithDetails>(
                `SELECT 
          nl.*,
          m.name as medicine_name,
          m.dosage as medicine_dosage,
          m.form as medicine_form
        FROM notification_logs nl
        JOIN medicines m ON nl.medicine_id = m.id
        ORDER BY nl.scheduled_time DESC
        LIMIT ?`,
                [limit]
            );
            return logs;
        } catch (error) {
            console.error('Error getting recent notification logs:', error);
            throw error;
        }
    }

    async deleteOldLogs(daysToKeep: number = 90): Promise<void> {
        try {
            await this.db.runAsync(
                `DELETE FROM notification_logs 
        WHERE datetime(created_at) < datetime('now', '-' || ? || ' days')`,
                [daysToKeep]
            );
        } catch (error) {
            console.error('Error deleting old notification logs:', error);
            throw error;
        }
    }

    async findByNotificationId(notificationId: string): Promise<NotificationLog | null> {
        try {
            const log = await this.db.getFirstAsync<NotificationLog>(
                'SELECT * FROM notification_logs WHERE notification_id = ? ORDER BY created_at DESC LIMIT 1',
                [notificationId]
            );
            return log || null;
        } catch (error) {
            console.error('Error finding notification log by ID:', error);
            throw error;
        }
    }

    async getTodayLogs(): Promise<NotificationLogWithDetails[]> {
        try {
            const logs = await this.db.getAllAsync<NotificationLogWithDetails>(
                `SELECT 
          nl.*,
          m.name as medicine_name,
          m.dosage as medicine_dosage,
          m.form as medicine_form
        FROM notification_logs nl
        JOIN medicines m ON nl.medicine_id = m.id
        WHERE date(nl.scheduled_time) = date('now')
        ORDER BY nl.scheduled_time DESC`
            );
            return logs;
        } catch (error) {
            console.error('Error getting today notification logs:', error);
            throw error;
        }
    }
}
