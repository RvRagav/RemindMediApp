import { Schedule, ScheduleWithMedicine } from '../../types';
import { database } from '../index';

export class ScheduleRepository {
    async getAll(activeOnly: boolean = true): Promise<Schedule[]> {
        const db = database.getDatabase();

        const query = activeOnly
            ? 'SELECT * FROM schedules WHERE active = 1 ORDER BY time ASC'
            : 'SELECT * FROM schedules ORDER BY time ASC';

        const results = await db.getAllAsync<any>(query);

        return results.map(this.mapToSchedule);
    }

    async getById(id: number): Promise<Schedule | null> {
        const db = database.getDatabase();

        const result = await db.getFirstAsync<any>(
            'SELECT * FROM schedules WHERE id = ?',
            [id]
        );

        if (!result) return null;

        return this.mapToSchedule(result);
    }

    async getByMedicineId(medicineId: number): Promise<Schedule[]> {
        const db = database.getDatabase();

        const results = await db.getAllAsync<any>(
            'SELECT * FROM schedules WHERE medicine_id = ? AND active = 1 ORDER BY time ASC',
            [medicineId]
        );

        return results.map(this.mapToSchedule);
    }

    async getWithMedicine(id: number): Promise<ScheduleWithMedicine | null> {
        const db = database.getDatabase();

        const result = await db.getFirstAsync<any>(
            `SELECT 
        s.*,
        m.id as med_id, m.name as med_name, m.dosage as med_dosage,
        m.form as med_form, m.instructions as med_instructions,
        m.color as med_color, m.icon as med_icon, m.active as med_active,
        m.created_at as med_created_at, m.updated_at as med_updated_at
      FROM schedules s
      JOIN medicines m ON s.medicine_id = m.id
      WHERE s.id = ?`,
            [id]
        );

        if (!result) return null;

        return {
            ...this.mapToSchedule(result),
            medicine: {
                id: result.med_id,
                name: result.med_name,
                dosage: result.med_dosage,
                form: result.med_form,
                instructions: result.med_instructions,
                color: result.med_color,
                icon: result.med_icon,
                active: result.med_active === 1,
                createdAt: result.med_created_at,
                updatedAt: result.med_updated_at,
            },
        };
    }

    async getTodaySchedules(): Promise<ScheduleWithMedicine[]> {
        const db = database.getDatabase();

        const today = new Date().toISOString().split('T')[0];
        const dayOfWeek = new Date().getDay();

        const results = await db.getAllAsync<any>(
            `SELECT 
        s.*,
        m.id as med_id, m.name as med_name, m.dosage as med_dosage,
        m.form as med_form, m.instructions as med_instructions,
        m.color as med_color, m.icon as med_icon, m.active as med_active,
        m.created_at as med_created_at, m.updated_at as med_updated_at
      FROM schedules s
      JOIN medicines m ON s.medicine_id = m.id
      WHERE s.active = 1 
        AND m.active = 1
        AND s.start_date <= ?
        AND (s.end_date IS NULL OR s.end_date >= ?)
        AND (
          s.recurrence = 'daily'
          OR (s.recurrence = 'weekly' AND s.recurrence_days LIKE ?)
          OR s.recurrence = 'as-needed'
        )
      ORDER BY s.time ASC`,
            [today, today, `%${dayOfWeek}%`]
        );

        return results.map(result => ({
            ...this.mapToSchedule(result),
            medicine: {
                id: result.med_id,
                name: result.med_name,
                dosage: result.med_dosage,
                form: result.med_form,
                instructions: result.med_instructions,
                color: result.med_color,
                icon: result.med_icon,
                active: result.med_active === 1,
                createdAt: result.med_created_at,
                updatedAt: result.med_updated_at,
            },
        }));
    }

    async create(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> {
        const db = database.getDatabase();

        const result = await db.runAsync(
            `INSERT INTO schedules (
        medicine_id, time, recurrence, recurrence_days, 
        start_date, end_date, notification_id, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                schedule.medicineId,
                schedule.time,
                schedule.recurrence,
                schedule.recurrenceDays || null,
                schedule.startDate,
                schedule.endDate || null,
                schedule.notificationId || null,
                schedule.active ? 1 : 0,
            ]
        );

        const newSchedule = await db.getFirstAsync<any>(
            'SELECT * FROM schedules WHERE id = ?',
            [result.lastInsertRowId]
        );

        return this.mapToSchedule(newSchedule);
    }

    async update(id: number, schedule: Partial<Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
        const db = database.getDatabase();

        const updates: string[] = [];
        const values: any[] = [];

        if (schedule.medicineId !== undefined) {
            updates.push('medicine_id = ?');
            values.push(schedule.medicineId);
        }
        if (schedule.time !== undefined) {
            updates.push('time = ?');
            values.push(schedule.time);
        }
        if (schedule.recurrence !== undefined) {
            updates.push('recurrence = ?');
            values.push(schedule.recurrence);
        }
        if (schedule.recurrenceDays !== undefined) {
            updates.push('recurrence_days = ?');
            values.push(schedule.recurrenceDays);
        }
        if (schedule.startDate !== undefined) {
            updates.push('start_date = ?');
            values.push(schedule.startDate);
        }
        if (schedule.endDate !== undefined) {
            updates.push('end_date = ?');
            values.push(schedule.endDate);
        }
        if (schedule.notificationId !== undefined) {
            updates.push('notification_id = ?');
            values.push(schedule.notificationId);
        }
        if (schedule.active !== undefined) {
            updates.push('active = ?');
            values.push(schedule.active ? 1 : 0);
        }

        if (updates.length === 0) return;

        updates.push('updated_at = datetime("now")');
        values.push(id);

        await db.runAsync(
            `UPDATE schedules SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    async delete(id: number): Promise<void> {
        const db = database.getDatabase();

        await db.runAsync('DELETE FROM schedules WHERE id = ?', [id]);
    }

    private mapToSchedule(row: any): Schedule {
        return {
            id: row.id,
            medicineId: row.medicine_id,
            time: row.time,
            recurrence: row.recurrence,
            recurrenceDays: row.recurrence_days,
            startDate: row.start_date,
            endDate: row.end_date,
            notificationId: row.notification_id,
            active: row.active === 1,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

export const scheduleRepository = new ScheduleRepository();
