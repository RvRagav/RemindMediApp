// User Profile Types
export interface UserProfile {
    id: number;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    healthIssue: string;
    languagePreference: 'en' | 'ta';
    createdAt: string;
    updatedAt: string;
}

// Medicine Types
export interface Medicine {
    id: number;
    name: string;
    dosage: string;
    form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'other';
    instructions: string;
    color?: string;
    icon?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Schedule Types
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom' | 'as-needed';
export type ScheduleStatus = 'pending' | 'taken' | 'skipped' | 'missed';

export interface Schedule {
    id: number;
    medicineId: number;
    time: string; // HH:mm format
    recurrence: RecurrenceType;
    recurrenceDays?: string; // JSON array of weekday numbers for weekly
    startDate: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
    notificationId?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// History Types
export interface MedicineHistory {
    id: number;
    scheduleId: number;
    medicineId: number;
    scheduledTime: string; // ISO datetime
    actionTime?: string; // ISO datetime
    status: ScheduleStatus;
    notes?: string;
    createdAt: string;
}

// Appointment Types
export interface Appointment {
    id: number;
    doctorName: string;
    specialty?: string;
    location: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    notes?: string;
    notificationId?: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

// Extended types with relations
export interface MedicineWithSchedules extends Medicine {
    schedules: Schedule[];
}

export interface ScheduleWithMedicine extends Schedule {
    medicine: Medicine;
}

export interface HistoryWithDetails extends MedicineHistory {
    medicine: Medicine;
    schedule: Schedule;
}

// Stats and Analytics
export interface MedicineStats {
    medicineId: number;
    medicineName: string;
    totalScheduled: number;
    totalTaken: number;
    totalSkipped: number;
    totalMissed: number;
    adherenceRate: number; // percentage
}

export interface DailyStats {
    date: string;
    totalScheduled: number;
    totalTaken: number;
    totalSkipped: number;
    totalMissed: number;
    adherenceRate: number;
}

// Calendar Event
export interface CalendarEvent {
    id: number;
    type: 'medicine' | 'appointment';
    title: string;
    time: string;
    status?: ScheduleStatus;
    data: Schedule | Appointment;
}
