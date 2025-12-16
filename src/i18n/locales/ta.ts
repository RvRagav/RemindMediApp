export const ta = {
    translation: {
        // Common
        common: {
            cancel: "ரத்து",
            save: "சேமி",
            delete: "நீக்கு",
            edit: "திருத்து",
            add: "சேர்",
            update: "புதுப்பி",
            create: "உருவாக்கு",
            back: "பின்",
            ok: "சரி",
            yes: "ஆம்",
            no: "இல்லை",
            search: "தேடு",
            loading: "ஏற்றுகிறது...",
        },

        // Tab Navigation
        tabs: {
            home: "முகப்பு",
            medications: "மருந்துகள்",
            schedule: "அட்டவணை",
            profile: "சுயவிவரம்",
        },

        // Home Screen
        home: {
            title: "மீண்டும் வரவேற்கிறோம்",
            goodMorning: "காலை வணக்கம்",
            goodAfternoon: "மதிய வணக்கம்",
            goodEvening: "மாலை வணக்கம்",
            subtitle: "உங்கள் உடல்நலத்தை கவனித்துக் கொள்ள நேரம்",
            todaysMedications: "இன்றைய மருந்துகள்",
            upcomingDoses: "வரவிருக்கும் மருந்துகள்",
            takenToday: "இன்று எடுத்தது",
            medications: "மருந்துகள்",
            yourMedications: "உங்கள் மருந்துகள்",
            noMedications: "இன்னும் மருந்துகள் சேர்க்கப்படவில்லை",
            addFirst: "தொடங்க உங்கள் முதல் மருந்தை சேர்க்கவும்",
        },

        // Medications Screen
        medications: {
            title: "மருந்துகள்",
            myMedications: "என் மருந்துகள்",
            noMedications: "மருந்துகள் இல்லை",
            addFirst: "உங்கள் முதல் மருந்தை சேர்க்கவும்",
            addMedication: "மருந்து சேர்",
            details: "மருந்து விவரங்கள்",
            editMedication: "மருந்தை திருத்து",
            deleteMedication: "மருந்தை நீக்கு",
            deleteConfirm: "{{name}} ஐ நீக்க விரும்புகிறீர்களா? இது தொடர்புடைய அனைத்து அட்டவணைகளையும் நீக்கும்.",
            deleted: "மருந்து வெற்றிகரமாக நீக்கப்பட்டது",
        },

        // Medication Form
        medicationForm: {
            name: "மருந்தின் பெயர்",
            namePlaceholder: "உதா., ஆஸ்பிரின்",
            nameRequired: "மருந்தின் பெயர் தேவை",
            dosage: "அளவு",
            dosagePlaceholder: "உதா., 100mg",
            dosageRequired: "அளவு தேவை",
            formType: "வகை",
            color: "நிறம்",
            instructions: "வழிமுறைகள் (விரும்பினால்)",
            instructionsPlaceholder: "உதா., உணவுடன் எடுக்கவும்",
            created: "மருந்து வெற்றிகரமாக உருவாக்கப்பட்டது",
            updated: "மருந்து வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
            error: "மருந்தை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        },

        // Medication Details
        medicationDetails: {
            details: "விவரங்கள்",
            form: "வகை",
            instructions: "வழிமுறைகள்",
            status: "நிலை",
            active: "செயலில்",
            inactive: "செயலில் இல்லை",
            schedules: "அட்டவணைகள்",
            noSchedules: "இந்த மருந்துக்கு அட்டவணை இல்லை",
        },

        // Schedule Screen
        schedule: {
            title: "அட்டவணை",
            today: "இன்று",
            noSchedules: "இன்று அட்டவணை இல்லை",
            addFirst: "உங்கள் முதல் மருந்து அட்டவணையை சேர்க்கவும்",
            addSchedule: "அட்டவணை சேர்",
            editSchedule: "அட்டவணையை திருத்து",
            deleteSchedule: "அட்டவணையை நீக்கு",
            deleteConfirm: "இந்த அட்டவணையை நீக்க விரும்புகிறீர்களா?",
            created: "அட்டவணை வெற்றிகரமாக உருவாக்கப்பட்டது",
            updated: "அட்டவணை வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
            deleted: "அட்டவணை வெற்றிகரமாக நீக்கப்பட்டது",
        },

        // Schedule Form
        scheduleForm: {
            medication: "மருந்து",
            medicationRequired: "தயவுசெய்து மருந்தை தேர்ந்தெடுக்கவும்",
            selectMedication: "மருந்தை தேர்ந்தெடுக்கவும்",
            time: "நேரம்",
            recurrence: "மீண்டும் நிகழ்வு",
            selectDays: "நாட்களை தேர்ந்தெடுக்கவும்",
            selectDaysRequired: "குறைந்தது ஒரு நாளை தேர்ந்தெடுக்கவும்",
            startDate: "தொடக்க தேதி",
            endDate: "முடிவு தேதி (விரும்பினால்)",
            noEndDate: "முடிவு தேதி இல்லை",
            clearEndDate: "முடிவு தேதியை அழி",
            error: "அட்டவணையை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        },

        // Recurrence Types
        recurrence: {
            daily: "தினசரி",
            weekly: "வாரந்தோறும்",
            monthly: "மாதந்தோறும்",
            custom: "தனிப்பயன்",
            "as-needed": "தேவைக்கேற்ப",
        },

        // Days of Week
        days: {
            sunday: "ஞாயிறு",
            monday: "திங்கள்",
            tuesday: "செவ்வாய்",
            wednesday: "புதன்",
            thursday: "வியாழன்",
            friday: "வெள்ளி",
            saturday: "சனி",
            sun: "ஞா",
            mon: "தி",
            tue: "செ",
            wed: "பு",
            thu: "வி",
            fri: "வெ",
            sat: "ச",
        },

        // Medicine Forms
        forms: {
            tablet: "மாத்திரை",
            capsule: "காப்சூல்",
            liquid: "திரவம்",
            injection: "ஊசி",
            cream: "க்ரீம்",
            other: "மற்றவை",
        },

        // Profile Screen
        profile: {
            title: "சுயவிவரம்",
            editProfile: "சுயவிவரத்தை திருத்து",
            healthInfo: "சுகாதார தகவல்",
            healthCondition: "சுகாதார நிலை",
            settings: "அமைப்புகள்",
            language: "மொழி",
            notifications: "அறிவிப்புகள்",
            notificationHistory: "அறிவிப்பு வரலாறு",
            reminderSettings: "நினைவூட்டல் அமைப்புகள்",
            testNotification: "சோதனை அறிவிப்பு",
            testNotificationMessage: "உங்கள் அறிவிப்பு பட்டியைச் சரிபார்க்கவும்!",
            data: "தரவு",
            exportData: "தரவை ஏற்றுமதி செய்",
            clearAllData: "அனைத்து தரவையும் அழி",
            age: "வயது",
            gender: "பாலினம்",
            name: "பெயர்",
            namePlaceholder: "உங்கள் பெயரை உள்ளிடவும்",
            nameRequired: "பெயர் தேவை",
            ageRequired: "வயது தேவை",
            healthIssue: "சுகாதார பிரச்சினை",
            healthIssuePlaceholder: "உதா., உயர் இரத்த அழுத்தம், நீரிழிவு",
            updated: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
            error: "சுயவிவரத்தை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        },

        // Notification History
        notificationHistory: {
            title: "அறிவிப்பு வரலாறு",
            pending: "நிலுவையில்",
            all: "அனைத்தும்",
            taken: "எடுத்தது",
            skipped: "தவிர்த்தது",
            noPending: "நிலுவையில் அறிவிப்புகள் இல்லை",
            noTaken: "எடுக்கப்பட்ட அறிவிப்புகள் இல்லை",
            noSkipped: "தவிர்க்கப்பட்ட அறிவிப்புகள் இல்லை",
            noAll: "அறிவிப்புகள் இல்லை",
            scheduled: "திட்டமிடப்பட்டது",
            responded: "பதிலளித்தது",
            medicationReminder: "மருந்து நினைவூட்டல்",
            didYouTake: "நீங்கள் எடுத்தீர்களா",
            yourMedication: "உங்கள் மருந்து",
            markedAs: "மருந்து குறிக்கப்பட்டது",
            success: "வெற்றி",
            error: "பிழை",
            failedToRecord: "மருந்து நிலையை பதிவு செய்ய முடியவில்லை",
            tapToRespond: "எடுத்தது அல்லது தவிர்த்தது என குறிக்க தொடவும்",
        },

        // Gender
        gender: {
            male: "ஆண்",
            female: "பெண்",
            other: "மற்றவை",
        },

        // Languages
        languages: {
            en: "ஆங்கிலம்",
            ta: "தமிழ்",
        },

        // Success/Error Messages
        messages: {
            success: "வெற்றி",
            error: "பிழை",
            confirmDelete: "நீக்குவதை உறுதிப்படுத்தவும்",
        },
    },
};
