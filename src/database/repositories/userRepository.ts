import { UserProfile } from '../../types';
import { database } from '../index';

export class UserRepository {
    async getProfile(): Promise<UserProfile | null> {
        const db = database.getDatabase();

        const result = await db.getFirstAsync<any>(
            'SELECT * FROM user_profile LIMIT 1'
        );

        if (!result) return null;

        return {
            id: result.id,
            name: result.name,
            age: result.age,
            gender: result.gender,
            healthIssue: result.health_issue,
            languagePreference: result.language_preference,
            createdAt: result.created_at,
            updatedAt: result.updated_at,
        };
    }

    async createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
        const db = database.getDatabase();

        const result = await db.runAsync(
            `INSERT INTO user_profile (name, age, gender, health_issue, language_preference) 
       VALUES (?, ?, ?, ?, ?)`,
            [profile.name, profile.age, profile.gender, profile.healthIssue, profile.languagePreference]
        );

        const newProfile = await db.getFirstAsync<any>(
            'SELECT * FROM user_profile WHERE id = ?',
            [result.lastInsertRowId]
        );

        return {
            id: newProfile.id,
            name: newProfile.name,
            age: newProfile.age,
            gender: newProfile.gender,
            healthIssue: newProfile.health_issue,
            languagePreference: newProfile.language_preference,
            createdAt: newProfile.created_at,
            updatedAt: newProfile.updated_at,
        };
    }

    async updateProfile(id: number, profile: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
        const db = database.getDatabase();

        const updates: string[] = [];
        const values: any[] = [];

        if (profile.name !== undefined) {
            updates.push('name = ?');
            values.push(profile.name);
        }
        if (profile.age !== undefined) {
            updates.push('age = ?');
            values.push(profile.age);
        }
        if (profile.gender !== undefined) {
            updates.push('gender = ?');
            values.push(profile.gender);
        }
        if (profile.healthIssue !== undefined) {
            updates.push('health_issue = ?');
            values.push(profile.healthIssue);
        }
        if (profile.languagePreference !== undefined) {
            updates.push('language_preference = ?');
            values.push(profile.languagePreference);
        }

        if (updates.length === 0) return;

        updates.push('updated_at = datetime("now")');
        values.push(id);

        await db.runAsync(
            `UPDATE user_profile SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }
}

export const userRepository = new UserRepository();
