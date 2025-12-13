import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useMedicineStore, useScheduleStore } from "../store";
import { RecurrenceType } from "../types";

const RECURRENCE_OPTIONS: RecurrenceType[] = ["daily", "weekly", "monthly", "custom", "as-needed"];

const WEEKDAYS = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
];

export default function AddScheduleForm() {
    const router = useRouter();
    const { medicineId } = useLocalSearchParams<{ medicineId: string }>();
    const { medicines, fetchMedicines } = useMedicineStore();
    const { createSchedule, isLoading } = useScheduleStore();

    const [formData, setFormData] = useState({
        medicineId: medicineId ? Number(medicineId) : 0,
        time: new Date(),
        recurrence: "daily" as RecurrenceType,
        recurrenceDays: [] as number[],
        startDate: new Date(),
        endDate: null as Date | null,
    });

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (medicines.length === 0) {
            fetchMedicines();
        }
    }, []);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.medicineId) {
            newErrors.medicineId = "Please select a medication";
        }
        if (formData.recurrence === "weekly" && formData.recurrenceDays.length === 0) {
            newErrors.recurrenceDays = "Please select at least one day";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const timeString = `${formData.time.getHours().toString().padStart(2, "0")}:${formData.time
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;

            const startDateString = formData.startDate.toISOString().split("T")[0];
            const endDateString = formData.endDate ? formData.endDate.toISOString().split("T")[0] : undefined;

            await createSchedule({
                medicineId: formData.medicineId,
                time: timeString,
                recurrence: formData.recurrence,
                recurrenceDays: formData.recurrence === "weekly" ? JSON.stringify(formData.recurrenceDays) : undefined,
                startDate: startDateString,
                endDate: endDateString,
                active: true,
            });

            Alert.alert("Success", "Schedule created successfully", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert("Error", "Failed to create schedule. Please try again.");
        }
    };

    const toggleWeekday = (day: number) => {
        setFormData((prev) => ({
            ...prev,
            recurrenceDays: prev.recurrenceDays.includes(day)
                ? prev.recurrenceDays.filter((d) => d !== day)
                : [...prev.recurrenceDays, day],
        }));
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                {/* Medicine Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Medication *</Text>
                    <View style={[styles.pickerContainer, errors.medicineId && styles.inputError]}>
                        <Picker
                            selectedValue={formData.medicineId}
                            onValueChange={(value) => setFormData({ ...formData, medicineId: value })}
                            style={styles.picker}
                            enabled={!medicineId}
                        >
                            <Picker.Item label="Select medication" value={0} />
                            {medicines.map((med) => (
                                <Picker.Item key={med.id} label={`${med.name} (${med.dosage})`} value={med.id} />
                            ))}
                        </Picker>
                    </View>
                    {errors.medicineId && <Text style={styles.errorText}>{errors.medicineId}</Text>}
                </View>

                {/* Time Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Time *</Text>
                    <Pressable style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
                        <Ionicons name="time-outline" size={20} color="#007AFF" />
                        <Text style={styles.dateButtonText}>{formatTime(formData.time)}</Text>
                    </Pressable>
                </View>

                {/* Recurrence Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Recurrence</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.recurrence}
                            onValueChange={(value) => setFormData({ ...formData, recurrence: value })}
                            style={styles.picker}
                        >
                            {RECURRENCE_OPTIONS.map((option) => (
                                <Picker.Item
                                    key={option}
                                    label={option.charAt(0).toUpperCase() + option.slice(1)}
                                    value={option}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Weekly Days Selector */}
                {formData.recurrence === "weekly" && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Select Days *</Text>
                        <View style={styles.weekdaysContainer}>
                            {WEEKDAYS.map((day) => (
                                <Pressable
                                    key={day.value}
                                    style={[
                                        styles.weekdayButton,
                                        formData.recurrenceDays.includes(day.value) && styles.weekdayButtonSelected,
                                    ]}
                                    onPress={() => toggleWeekday(day.value)}
                                >
                                    <Text
                                        style={[
                                            styles.weekdayButtonText,
                                            formData.recurrenceDays.includes(day.value) &&
                                            styles.weekdayButtonTextSelected,
                                        ]}
                                    >
                                        {day.label.substring(0, 3)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        {errors.recurrenceDays && <Text style={styles.errorText}>{errors.recurrenceDays}</Text>}
                    </View>
                )}

                {/* Start Date */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Start Date *</Text>
                    <Pressable style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
                        <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                        <Text style={styles.dateButtonText}>{formatDate(formData.startDate)}</Text>
                    </Pressable>
                </View>

                {/* End Date */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>End Date (Optional)</Text>
                    <Pressable style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
                        <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                        <Text style={styles.dateButtonText}>
                            {formData.endDate ? formatDate(formData.endDate) : "No end date"}
                        </Text>
                    </Pressable>
                    {formData.endDate && (
                        <Pressable
                            style={styles.clearButton}
                            onPress={() => setFormData({ ...formData, endDate: null })}
                        >
                            <Text style={styles.clearButtonText}>Clear end date</Text>
                        </Pressable>
                    )}
                </View>

                {/* Submit Button */}
                <Pressable
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.submitButtonText}>Create Schedule</Text>
                        </>
                    )}
                </Pressable>

                {/* Cancel Button */}
                <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
            </View>

            {/* Time Picker Modal */}
            {showTimePicker && (
                <DateTimePicker
                    value={formData.time}
                    mode="time"
                    is24Hour={false}
                    onChange={(event, date) => {
                        setShowTimePicker(false);
                        if (event.type === "set" && date) {
                            setFormData({ ...formData, time: date });
                        }
                    }}
                />
            )}

            {/* Start Date Picker Modal */}
            {showStartDatePicker && (
                <DateTimePicker
                    value={formData.startDate}
                    mode="date"
                    onChange={(event, date) => {
                        setShowStartDatePicker(false);
                        if (event.type === "set" && date) {
                            setFormData({ ...formData, startDate: date });
                        }
                    }}
                />
            )}

            {/* End Date Picker Modal */}
            {showEndDatePicker && (
                <DateTimePicker
                    value={formData.endDate || new Date()}
                    mode="date"
                    minimumDate={formData.startDate}
                    onChange={(event, date) => {
                        setShowEndDatePicker(false);
                        if (event.type === "set" && date) {
                            setFormData({ ...formData, endDate: date });
                        }
                    }}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        overflow: "hidden",
    },
    picker: {
        height: 50,
    },
    inputError: {
        borderColor: "#FF3B30",
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 5,
    },
    dateButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    dateButtonText: {
        fontSize: 16,
        color: "#333",
    },
    weekdaysContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    weekdayButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    weekdayButtonSelected: {
        backgroundColor: "#007AFF",
        borderColor: "#007AFF",
    },
    weekdayButtonText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
    weekdayButtonTextSelected: {
        color: "#fff",
    },
    clearButton: {
        marginTop: 8,
        alignSelf: "flex-start",
    },
    clearButtonText: {
        color: "#007AFF",
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: "#007AFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 10,
        gap: 8,
        marginTop: 10,
    },
    submitButtonDisabled: {
        backgroundColor: "#ccc",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButton: {
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        padding: 16,
        borderRadius: 10,
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "600",
    },
});
