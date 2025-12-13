export const en = {
    translation: {
        // Common
        common: {
            cancel: "Cancel",
            save: "Save",
            delete: "Delete",
            edit: "Edit",
            add: "Add",
            update: "Update",
            create: "Create",
            back: "Back",
            ok: "OK",
            yes: "Yes",
            no: "No",
            search: "Search",
            loading: "Loading...",
        },

        // Tab Navigation
        tabs: {
            home: "Home",
            medications: "Medications",
            schedule: "Schedule",
            profile: "Profile",
        },

        // Home Screen
        home: {
            title: "Welcome Back",
            goodMorning: "Good Morning",
            goodAfternoon: "Good Afternoon",
            goodEvening: "Good Evening",
            subtitle: "time to take care of your health",
            todaysMedications: "Today's Medications",
            upcomingDoses: "Upcoming Doses",
            takenToday: "Taken Today",
            medications: "Medications",
            yourMedications: "Your Medications",
            noMedications: "No medications added yet",
            addFirst: "Add your first medication to get started",
        },

        // Medications Screen
        medications: {
            title: "Medications",
            myMedications: "My Medications",
            noMedications: "No Medications",
            addFirst: "Add your first medication",
            addMedication: "Add Medication",
            details: "Medication Details",
            editMedication: "Edit Medication",
            deleteMedication: "Delete Medication",
            deleteConfirm: "Are you sure you want to delete {{name}}? This will also delete all associated schedules.",
            deleted: "Medication deleted successfully",
        },

        // Medication Form
        medicationForm: {
            name: "Medicine Name",
            namePlaceholder: "e.g., Aspirin",
            nameRequired: "Medicine name is required",
            dosage: "Dosage",
            dosagePlaceholder: "e.g., 100mg",
            dosageRequired: "Dosage is required",
            formType: "Form Type",
            color: "Color",
            instructions: "Instructions (Optional)",
            instructionsPlaceholder: "e.g., Take with food",
            created: "Medication created successfully",
            updated: "Medication updated successfully",
            error: "Failed to save medication. Please try again.",
        },

        // Medication Details
        medicationDetails: {
            details: "Details",
            form: "Form",
            instructions: "Instructions",
            status: "Status",
            active: "Active",
            inactive: "Inactive",
            schedules: "Schedules",
            noSchedules: "No schedules set for this medication",
        },

        // Schedule Screen
        schedule: {
            title: "Schedule",
            today: "Today",
            noSchedules: "No Schedules Today",
            addFirst: "Add your first medication schedule",
            addSchedule: "Add Schedule",
            editSchedule: "Edit Schedule",
            deleteSchedule: "Delete Schedule",
            deleteConfirm: "Are you sure you want to delete this schedule?",
            created: "Schedule created successfully",
            updated: "Schedule updated successfully",
            deleted: "Schedule deleted successfully",
        },

        // Schedule Form
        scheduleForm: {
            medication: "Medication",
            medicationRequired: "Please select a medication",
            selectMedication: "Select medication",
            time: "Time",
            recurrence: "Recurrence",
            selectDays: "Select Days",
            selectDaysRequired: "Please select at least one day",
            startDate: "Start Date",
            endDate: "End Date (Optional)",
            noEndDate: "No end date",
            clearEndDate: "Clear end date",
            error: "Failed to save schedule. Please try again.",
        },

        // Recurrence Types
        recurrence: {
            daily: "Daily",
            weekly: "Weekly",
            monthly: "Monthly",
            custom: "Custom",
            "as-needed": "As Needed",
        },

        // Days of Week
        days: {
            sunday: "Sunday",
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sun: "Sun",
            mon: "Mon",
            tue: "Tue",
            wed: "Wed",
            thu: "Thu",
            fri: "Fri",
            sat: "Sat",
        },

        // Medicine Forms
        forms: {
            tablet: "Tablet",
            capsule: "Capsule",
            liquid: "Liquid",
            injection: "Injection",
            cream: "Cream",
            other: "Other",
        },

        // Profile Screen
        profile: {
            title: "Profile",
            editProfile: "Edit Profile",
            healthInfo: "Health Information",
            healthCondition: "Health Condition",
            settings: "Settings",
            language: "Language",
            notifications: "Notifications",
            reminderSettings: "Reminder Settings",
            data: "Data",
            exportData: "Export Data",
            clearAllData: "Clear All Data",
            age: "Age",
            gender: "Gender",
            name: "Name",
            namePlaceholder: "Enter your name",
            nameRequired: "Name is required",
            ageRequired: "Age is required",
            healthIssue: "Health Issue",
            healthIssuePlaceholder: "e.g., Hypertension, Diabetes",
            updated: "Profile updated successfully",
            error: "Failed to update profile. Please try again.",
        },

        // Gender
        gender: {
            male: "Male",
            female: "Female",
            other: "Other",
        },

        // Languages
        languages: {
            en: "English",
            ta: "Tamil",
        },

        // Success/Error Messages
        messages: {
            success: "Success",
            error: "Error",
            confirmDelete: "Confirm Delete",
        },
    },
};
