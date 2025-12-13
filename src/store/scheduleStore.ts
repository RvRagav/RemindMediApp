import { create } from 'zustand';
import { scheduleRepository } from '../database/repositories';
import { Schedule, ScheduleWithMedicine } from '../types';

interface ScheduleState {
    schedules: Schedule[];
    todaySchedules: ScheduleWithMedicine[];
    selectedSchedule: ScheduleWithMedicine | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSchedules: () => Promise<void>;
    fetchTodaySchedules: () => Promise<void>;
    fetchScheduleById: (id: number) => Promise<void>;
    createSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Schedule>;
    updateSchedule: (id: number, updates: Partial<Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteSchedule: (id: number) => Promise<void>;
    clearSelectedSchedule: () => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    schedules: [],
    todaySchedules: [],
    selectedSchedule: null,
    isLoading: false,
    error: null,

    fetchSchedules: async () => {
        set({ isLoading: true, error: null });
        try {
            const schedules = await scheduleRepository.getAll();
            set({ schedules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch schedules',
                isLoading: false
            });
        }
    },

    fetchTodaySchedules: async () => {
        set({ isLoading: true, error: null });
        try {
            const todaySchedules = await scheduleRepository.getTodaySchedules();
            set({ todaySchedules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch today schedules',
                isLoading: false
            });
        }
    },

    fetchScheduleById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const schedule = await scheduleRepository.getWithMedicine(id);
            set({ selectedSchedule: schedule, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch schedule',
                isLoading: false
            });
        }
    },

    createSchedule: async (scheduleData) => {
        set({ isLoading: true, error: null });
        try {
            const schedule = await scheduleRepository.create(scheduleData);
            await get().fetchSchedules();
            await get().fetchTodaySchedules();
            set({ isLoading: false });
            return schedule;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create schedule',
                isLoading: false
            });
            throw error;
        }
    },

    updateSchedule: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await scheduleRepository.update(id, updates);
            await get().fetchSchedules();
            await get().fetchTodaySchedules();
            if (get().selectedSchedule?.id === id) {
                await get().fetchScheduleById(id);
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update schedule',
                isLoading: false
            });
            throw error;
        }
    },

    deleteSchedule: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await scheduleRepository.delete(id);
            await get().fetchSchedules();
            await get().fetchTodaySchedules();
            if (get().selectedSchedule?.id === id) {
                set({ selectedSchedule: null });
            }
            set({ isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete schedule',
                isLoading: false
            });
            throw error;
        }
    },

    clearSelectedSchedule: () => {
        set({ selectedSchedule: null });
    },
}));
