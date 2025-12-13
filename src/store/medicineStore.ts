import { create } from 'zustand';
import { medicineRepository } from '../database/repositories';
import { Medicine, MedicineWithSchedules } from '../types';

interface MedicineState {
    medicines: Medicine[];
    selectedMedicine: MedicineWithSchedules | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchMedicines: () => Promise<void>;
    fetchMedicineById: (id: number) => Promise<void>;
    createMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Medicine>;
    updateMedicine: (id: number, updates: Partial<Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteMedicine: (id: number) => Promise<void>;
    clearSelectedMedicine: () => void;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
    medicines: [],
    selectedMedicine: null,
    isLoading: false,
    error: null,

    fetchMedicines: async () => {
        set({ isLoading: true, error: null });
        try {
            const medicines = await medicineRepository.getAll();
            set({ medicines, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch medicines',
                isLoading: false
            });
        }
    },

    fetchMedicineById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const medicine = await medicineRepository.getWithSchedules(id);
            set({ selectedMedicine: medicine, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch medicine',
                isLoading: false
            });
        }
    },

    createMedicine: async (medicineData) => {
        set({ isLoading: true, error: null });
        try {
            const medicine = await medicineRepository.create(medicineData);
            await get().fetchMedicines();
            set({ isLoading: false });
            return medicine;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create medicine',
                isLoading: false
            });
            throw error;
        }
    },

    updateMedicine: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await medicineRepository.update(id, updates);
            await get().fetchMedicines();
            if (get().selectedMedicine?.id === id) {
                await get().fetchMedicineById(id);
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update medicine',
                isLoading: false
            });
            throw error;
        }
    },

    deleteMedicine: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await medicineRepository.delete(id);
            await get().fetchMedicines();
            if (get().selectedMedicine?.id === id) {
                set({ selectedMedicine: null });
            }
            set({ isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete medicine',
                isLoading: false
            });
            throw error;
        }
    },

    clearSelectedMedicine: () => {
        set({ selectedMedicine: null });
    },
}));
