import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useMedicineStore } from "../store";
import { Medicine } from "../types";

const MEDICINE_FORMS = ["tablet", "capsule", "liquid", "injection", "cream", "other"] as const;
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];

export default function AddMedicationForm() {
    const router = useRouter();
    const { createMedicine, isLoading } = useMedicineStore();

    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        form: "tablet" as Medicine["form"],
        instructions: "",
        color: COLORS[0],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Medicine name is required";
        }
        if (!formData.dosage.trim()) {
            newErrors.dosage = "Dosage is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            await createMedicine({
                name: formData.name.trim(),
                dosage: formData.dosage.trim(),
                form: formData.form,
                instructions: formData.instructions.trim(),
                color: formData.color,
                active: true,
            });

            Alert.alert("Success", "Medication added successfully", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            Alert.alert("Error", "Failed to add medication");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#000" />
                </Pressable>
                <Text style={styles.title}>Add Medication</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                {/* Medicine Name */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Medicine Name *</Text>
                    <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        placeholder="e.g., Aspirin"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                {/* Dosage */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Dosage *</Text>
                    <TextInput
                        style={[styles.input, errors.dosage && styles.inputError]}
                        placeholder="e.g., 100mg"
                        value={formData.dosage}
                        onChangeText={(text) => setFormData({ ...formData, dosage: text })}
                    />
                    {errors.dosage && <Text style={styles.errorText}>{errors.dosage}</Text>}
                </View>

                {/* Form Type */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Form</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.form}
                            onValueChange={(value) => setFormData({ ...formData, form: value })}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            mode="dropdown"
                        >
                            {MEDICINE_FORMS.map((form) => (
                                <Picker.Item
                                    key={form}
                                    label={form.charAt(0).toUpperCase() + form.slice(1)}
                                    value={form}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Color */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Color</Text>
                    <View style={styles.colorContainer}>
                        {COLORS.map((color) => (
                            <Pressable
                                key={color}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    formData.color === color && styles.colorSelected,
                                ]}
                                onPress={() => setFormData({ ...formData, color })}
                            >
                                {formData.color === color && (
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Instructions (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="e.g., Take with food"
                        value={formData.instructions}
                        onChangeText={(text) => setFormData({ ...formData, instructions: text })}
                        multiline
                        numberOfLines={4}
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    inputError: {
        borderColor: "#F44336",
    },
    errorText: {
        color: "#F44336",
        fontSize: 14,
        marginTop: 4,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        overflow: "hidden",
    },
    picker: {
        height: 50,
        color: '#333',
    },
    pickerItem: {
        fontSize: 16,
        height: 50,
        color: '#333',
    },
    colorContainer: {
        flexDirection: "row",
        gap: 12,
    },
    colorOption: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorSelected: {
        borderColor: "#333",
    },
    footer: {
        flexDirection: "row",
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f0f0f0",
    },
    cancelButtonText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "600",
    },
    saveButton: {
        backgroundColor: "#007AFF",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
