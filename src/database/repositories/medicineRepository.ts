import { Medicine, MedicineWithSchedules, Schedule } from '../../types';
import { database } from '../index';

export class MedicineRepository {
    async getAll(activeOnly: boolean = true): Promise<Medicine[]> {
        const db = database.getDatabase();

        const query = activeOnly
            ? 'SELECT * FROM medicines WHERE active = 1 ORDER BY name ASC'
            : 'SELECT * FROM medicines ORDER BY name ASC';

        const results = await db.getAllAsync<any>(query);

        return results.map(this.mapToMedicine);
    }

    async getById(id: number): Promise<Medicine | null> {
        const db = database.getDatabase();

        const result = await db.getFirstAsync<any>(
            'SELECT * FROM medicines WHERE id = ?',
            [id]
        );

        if (!result) return null;

        return this.mapToMedicine(result);
    }

    async getWithSchedules(id: number): Promise<MedicineWithSchedules | null> {
        const db = database.getDatabase();

        const medicine = await this.getById(id);
        if (!medicine) return null;

        const schedules = await db.getAllAsync<any>(
            'SELECT * FROM schedules WHERE medicine_id = ? AND active = 1',
            [id]
        );

        return {
            ...medicine,
            schedules: schedules.map(this.mapToSchedule),
        };
    }

    async create(medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Medicine> {
        const db = database.getDatabase();

        const result = await db.runAsync(
            `INSERT INTO medicines (name, dosage, form, instructions, color, icon, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                medicine.name,
                medicine.dosage,
                medicine.form,
                medicine.instructions,
                medicine.color || null,
                medicine.icon || null,
                medicine.active ? 1 : 0,
            ]
        );

        const newMedicine = await db.getFirstAsync<any>(
            'SELECT * FROM medicines WHERE id = ?',
            [result.lastInsertRowId]
        );

        return this.mapToMedicine(newMedicine);
    }

    async update(id: number, medicine: Partial<Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
        const db = database.getDatabase();

        const updates: string[] = [];
        const values: any[] = [];

        if (medicine.name !== undefined) {
            updates.push('name = ?');
            values.push(medicine.name);
        }
        if (medicine.dosage !== undefined) {
            updates.push('dosage = ?');
            values.push(medicine.dosage);
        }
        if (medicine.form !== undefined) {
            updates.push('form = ?');
            values.push(medicine.form);
        }
        if (medicine.instructions !== undefined) {
            updates.push('instructions = ?');
            values.push(medicine.instructions);
        }
        if (medicine.color !== undefined) {
            updates.push('color = ?');
            values.push(medicine.color);
        }
        if (medicine.icon !== undefined) {
            updates.push('icon = ?');
            values.push(medicine.icon);
        }
        if (medicine.active !== undefined) {
            updates.push('active = ?');
            values.push(medicine.active ? 1 : 0);
        }

        if (updates.length === 0) return;

        updates.push('updated_at = datetime("now")');
        values.push(id);

        await db.runAsync(
            `UPDATE medicines SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    async delete(id: number): Promise<void> {
        const db = database.getDatabase();

        // Soft delete
        await db.runAsync(
            'UPDATE medicines SET active = 0, updated_at = datetime("now") WHERE id = ?',
            [id]
        );
    }

    async hardDelete(id: number): Promise<void> {
        const db = database.getDatabase();

        // This will cascade delete schedules and history due to foreign keys
        await db.runAsync('DELETE FROM medicines WHERE id = ?', [id]);
    }

    private mapToMedicine(row: any): Medicine {
        return {
            id: row.id,
            name: row.name,
            dosage: row.dosage,
            form: row.form,
            instructions: row.instructions,
            color: row.color,
            icon: row.icon,
            active: row.active === 1,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
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

export const medicineRepository = new MedicineRepository();
