// Database Schema Definitions for SQLite

export const CREATE_USER_PROFILE_TABLE = `
CREATE TABLE IF NOT EXISTS user_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('male', 'female', 'other')),
  health_issue TEXT,
  language_preference TEXT NOT NULL DEFAULT 'en' CHECK(language_preference IN ('en', 'ta')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const CREATE_MEDICINES_TABLE = `
CREATE TABLE IF NOT EXISTS medicines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  form TEXT NOT NULL CHECK(form IN ('tablet', 'capsule', 'liquid', 'injection', 'cream', 'other')),
  instructions TEXT,
  color TEXT,
  icon TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const CREATE_SCHEDULES_TABLE = `
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medicine_id INTEGER NOT NULL,
  time TEXT NOT NULL,
  recurrence TEXT NOT NULL CHECK(recurrence IN ('daily', 'weekly', 'monthly', 'custom', 'as-needed')),
  recurrence_days TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  notification_id TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);
`;

export const CREATE_MEDICINE_HISTORY_TABLE = `
CREATE TABLE IF NOT EXISTS medicine_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schedule_id INTEGER NOT NULL,
  medicine_id INTEGER NOT NULL,
  scheduled_time TEXT NOT NULL,
  action_time TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending', 'taken', 'skipped', 'missed')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);
`;

export const CREATE_APPOINTMENTS_TABLE = `
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_name TEXT NOT NULL,
  specialty TEXT,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  notification_id TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// Indexes for better query performance
export const CREATE_INDEXES = [
    'CREATE INDEX IF NOT EXISTS idx_schedules_medicine_id ON schedules(medicine_id);',
    'CREATE INDEX IF NOT EXISTS idx_schedules_active ON schedules(active);',
    'CREATE INDEX IF NOT EXISTS idx_history_medicine_id ON medicine_history(medicine_id);',
    'CREATE INDEX IF NOT EXISTS idx_history_schedule_id ON medicine_history(schedule_id);',
    'CREATE INDEX IF NOT EXISTS idx_history_status ON medicine_history(status);',
    'CREATE INDEX IF NOT EXISTS idx_history_scheduled_time ON medicine_history(scheduled_time);',
    'CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);',
    'CREATE INDEX IF NOT EXISTS idx_appointments_completed ON appointments(completed);',
];

// Sample data for testing
export const INSERT_SAMPLE_DATA = {
    userProfile: `
    INSERT OR IGNORE INTO user_profile (id, name, age, gender, health_issue, language_preference)
    VALUES (1, 'John Doe', 45, 'male', 'Hypertension, Diabetes', 'en');
  `,
    medicines: `
    INSERT OR IGNORE INTO medicines (name, dosage, form, instructions, color, active)
    VALUES 
      ('Aspirin', '100mg', 'tablet', 'Take with food. Avoid taking on an empty stomach.', '#FF6B6B', 1),
      ('Vitamin D', '1000 IU', 'capsule', 'Take with breakfast.', '#4ECDC4', 1),
      ('Calcium', '500mg', 'tablet', 'Take 2 tablets with water.', '#45B7D1', 1);
  `,
};
