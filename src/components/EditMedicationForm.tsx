import { Ionicons } from "@expo/vector-icons";
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
    TextInput,
    View,
} from "react-native";
import { useMedicineStore } from "../store";
import { Medicine } from "../types";

const MEDICINE_FORMS = ["tablet", "capsule", "liquid", "injection", "cream", "other"] as const;
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];

export default function EditMedicationForm() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { selectedMedicine, fetchMedicineById, updateMedicine, isLoading } = useMedicineStore();

    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        form: "tablet" as Medicine["form"],
        instructions: "",
        color: COLORS[0],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (id) {
            fetchMedicineById(Number(id));
        }
    }, [id]);

    useEffect(() => {
        if (selectedMedicine) {
            setFormData({
                name: selectedMedicine.name,
                dosage: selectedMedicine.dosage,
                form: selectedMedicine.form,
                instructions: selectedMedicine.instructions || "",
                color: selectedMedicine.color || COLORS[0],
            });
        }
    }, [selectedMedicine]);

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
            if (id) {
                await updateMedicine(Number(id), formData);
                Alert.alert("Success", "Medication updated successfully", [
                    { text: "OK", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update medication. Please try again.");
        }
    };

    if (isLoading || !selectedMedicine) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                {/* Name Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Medicine Name *</Text>
                    <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="e.g., Aspirin"
                        placeholderTextColor="#999"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                {/* Dosage Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Dosage *</Text>
                    <TextInput
                        style={[styles.input, errors.dosage && styles.inputError]}
                        value={formData.dosage}
                        onChangeText={(text) => setFormData({ ...formData, dosage: text })}
                        placeholder="e.g., 100mg"
                        placeholderTextColor="#999"
                    />
                    {errors.dosage && <Text style={styles.errorText}>{errors.dosage}</Text>}
                </View>

                {/* Form Type Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Form Type</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.form}
                            onValueChange={(value) => setFormData({ ...formData, form: value })}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            mode="dropdown"
                        >
                            {MEDICINE_FORMS.map((form) => (
                                <Picker.Item key={form} label={form.charAt(0).toUpperCase() + form.slice(1)} value={form} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Color Selector */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Color</Text>
                    <View style={styles.colorContainer}>
                        {COLORS.map((color) => (
                            <Pressable
                                key={color}
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: color },
                                    formData.color === color && styles.colorBoxSelected,
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

                {/* Instructions Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Instructions (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.instructions}
                        onChangeText={(text) => setFormData({ ...formData, instructions: text })}
                        placeholder="e.g., Take with food"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
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
                            <Text style={styles.submitButtonText}>Update Medication</Text>
                        </>
                    )}
                </Pressable>

                {/* Cancel Button */}
                <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: "#333",
    },
    inputError: {
        borderColor: "#FF3B30",
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 5,
    },
    textArea: {
        height: 100,
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
        color: '#333',
    },
    pickerItem: {
        fontSize: 16,
        height: 50,
        color: '#333',
    },
    colorContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    colorBox: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    colorBoxSelected: {
        borderWidth: 3,
        borderColor: "#333",
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
