// Database & State Management Usage Examples

import { useEffect } from 'react';
import { useMedicineStore, useScheduleStore, useUserStore } from '../store';

// Example 1: Using User Store
export function UserProfileExample() {
    const { profile, fetchProfile, updateProfile } = useUserStore();

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLanguageChange = async () => {
        await updateProfile({ languagePreference: 'ta' });
    };

    return profile;
}

// Example 2: Using Medicine Store
export function MedicineListExample() {
    const { medicines, fetchMedicines, createMedicine } = useMedicineStore();

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleAddMedicine = async () => {
        await createMedicine({
            name: 'Aspirin',
            dosage: '100mg',
            form: 'tablet',
            instructions: 'Take with food',
            active: true,
        });
    };

    return medicines;
}

// Example 3: Using Schedule Store
export function TodayScheduleExample() {
    const { todaySchedules, fetchTodaySchedules } = useScheduleStore();

    useEffect(() => {
        fetchTodaySchedules();
    }, []);

    return todaySchedules;
}

// Example 4: Direct Database Access (if needed)
import { database } from '../database';
import { medicineRepository } from '../database/repositories';

export async function directDatabaseExample() {
    // Ensure database is initialized
    await database.init();

    // Use repository methods
    const medicines = await medicineRepository.getAll();
    console.log('Medicines:', medicines);

    // Get database instance for custom queries
    const db = database.getDatabase();
    const result = await db.getAllAsync('SELECT * FROM medicines WHERE active = 1');
    console.log('Active medicines:', result);
}
