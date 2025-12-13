# RemindMedi - Database & State Management

## Architecture Overview

This app uses **SQLite** for offline-first data persistence and **Zustand** for reactive state management.

## Structure

```
src/
├── database/
│   ├── index.ts                    # Database initialization
│   ├── schema.ts                   # Table definitions & SQL
│   └── repositories/               # Data access layer
│       ├── userRepository.ts       # User profile CRUD
│       ├── medicineRepository.ts   # Medicine CRUD
│       └── scheduleRepository.ts   # Schedule CRUD
├── store/
│   ├── userStore.ts                # User state management
│   ├── medicineStore.ts            # Medicine state management
│   └── scheduleStore.ts            # Schedule state management
├── types/
│   └── index.ts                    # TypeScript interfaces
└── providers/
    └── DatabaseProvider.tsx        # Database context provider
```

## Database Schema

### Tables

1. **user_profile** - User information
2. **medicines** - Medication details
3. **schedules** - Dosing schedules with recurrence
4. **medicine_history** - Taken/skipped/missed records
5. **appointments** - Doctor appointments

### Relationships

- `schedules.medicine_id` → `medicines.id`
- `medicine_history.medicine_id` → `medicines.id`
- `medicine_history.schedule_id` → `schedules.id`

## Usage Examples

### 1. Using Zustand Stores (Recommended)

```tsx
import { useMedicineStore } from '@/src/store';

function MedicineList() {
  const { medicines, fetchMedicines, isLoading } = useMedicineStore();

  useEffect(() => {
    fetchMedicines();
  }, []);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      data={medicines}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

### 2. Direct Repository Access

```tsx
import { medicineRepository } from '@/src/database/repositories';

async function addMedicine() {
  const medicine = await medicineRepository.create({
    name: 'Aspirin',
    dosage: '100mg',
    form: 'tablet',
    instructions: 'Take with food',
    active: true,
  });
}
```

### 3. Custom Database Queries

```tsx
import { database } from '@/src/database';

async function customQuery() {
  const db = database.getDatabase();
  const result = await db.getAllAsync(
    'SELECT * FROM medicines WHERE active = 1'
  );
  return result;
}
```

## State Management Features

### User Store
- `fetchProfile()` - Load user profile
- `updateProfile()` - Update profile fields
- `setLanguage()` - Switch language (en/ta)

### Medicine Store
- `fetchMedicines()` - Load all medicines
- `createMedicine()` - Add new medicine
- `updateMedicine()` - Update medicine
- `deleteMedicine()` - Soft delete medicine
- `fetchMedicineById()` - Load with schedules

### Schedule Store
- `fetchTodaySchedules()` - Get today's schedule
- `createSchedule()` - Add new schedule
- `updateSchedule()` - Update schedule
- `deleteSchedule()` - Remove schedule

## Database Initialization

The database is automatically initialized on app start via `DatabaseProvider` in `_layout.tsx`:

```tsx
<DatabaseProvider>
  <Stack>...</Stack>
</DatabaseProvider>
```

## Sample Data

Sample data is inserted on first run:
- 1 User profile (John Doe)
- 3 Medicines (Aspirin, Vitamin D, Calcium)

## Type Safety

All database operations are fully typed with TypeScript interfaces defined in `src/types/index.ts`.

## Next Steps

- Add history repository for tracking doses
- Add appointment repository
- Implement notification scheduling
- Add data export/import functionality
