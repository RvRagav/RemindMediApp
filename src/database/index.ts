import * as SQLite from 'expo-sqlite';
import {
    CREATE_APPOINTMENTS_TABLE,
    CREATE_INDEXES,
    CREATE_MEDICINE_HISTORY_TABLE,
    CREATE_MEDICINES_TABLE,
    CREATE_NOTIFICATION_LOGS_TABLE,
    CREATE_SCHEDULES_TABLE,
    CREATE_USER_PROFILE_TABLE,
} from './schema';

const DB_NAME = 'remindmedi.db';

class Database {
    private db: SQLite.SQLiteDatabase | null = null;
    private initialized = false;

    async init(): Promise<void> {
        if (this.initialized) return;

        try {
            this.db = await SQLite.openDatabaseAsync(DB_NAME);

            // Create tables
            await this.db.execAsync(CREATE_USER_PROFILE_TABLE);
            await this.db.execAsync(CREATE_MEDICINES_TABLE);
            await this.db.execAsync(CREATE_SCHEDULES_TABLE);
            await this.db.execAsync(CREATE_MEDICINE_HISTORY_TABLE);
            await this.db.execAsync(CREATE_APPOINTMENTS_TABLE);
            await this.db.execAsync(CREATE_NOTIFICATION_LOGS_TABLE);

            // Create indexes
            for (const indexQuery of CREATE_INDEXES) {
                await this.db.execAsync(indexQuery);
            }

            this.initialized = true;
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    getDatabase(): SQLite.SQLiteDatabase {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.db;
    }

    async clearAllData(): Promise<void> {
        if (!this.db) return;

        try {
            await this.db.execAsync('DELETE FROM medicine_history;');
            await this.db.execAsync('DELETE FROM schedules;');
            await this.db.execAsync('DELETE FROM medicines;');
            await this.db.execAsync('DELETE FROM appointments;');
            await this.db.execAsync('DELETE FROM user_profile;');
            console.log('All data cleared');
        } catch (error) {
            console.error('Error clearing data:', error);
            throw error;
        }
    }

    async dropAllTables(): Promise<void> {
        if (!this.db) return;

        try {
            await this.db.execAsync('DROP TABLE IF EXISTS medicine_history;');
            await this.db.execAsync('DROP TABLE IF EXISTS schedules;');
            await this.db.execAsync('DROP TABLE IF EXISTS medicines;');
            await this.db.execAsync('DROP TABLE IF EXISTS appointments;');
            await this.db.execAsync('DROP TABLE IF EXISTS user_profile;');
            this.initialized = false;
            console.log('All tables dropped');
        } catch (error) {
            console.error('Error dropping tables:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const database = new Database();
