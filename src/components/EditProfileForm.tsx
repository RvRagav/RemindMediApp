import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
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
import { useUserStore } from "../store";
import { UserProfile } from "../types";

const GENDERS: UserProfile["gender"][] = ["male", "female", "other"];

export default function EditProfileForm() {
    const router = useRouter();
    const { profile, updateProfile, createProfile, fetchProfile, isLoading } = useUserStore();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "male" as UserProfile["gender"],
        healthIssue: "",
        languagePreference: "en" as "en" | "ta",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name,
                age: profile.age.toString(),
                gender: profile.gender,
                healthIssue: profile.healthIssue,
                languagePreference: profile.languagePreference,
            });
        }
    }, [profile]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) < 1) {
            newErrors.age = "Valid age is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const profileData = {
                name: formData.name,
                age: Number(formData.age),
                gender: formData.gender,
                healthIssue: formData.healthIssue,
                languagePreference: formData.languagePreference,
            };

            if (profile) {
                await updateProfile(profileData);
                Alert.alert("Success", "Profile updated successfully", [
                    { text: "OK", onPress: () => router.back() },
                ]);
            } else {
                await createProfile(profileData);
                Alert.alert("Success", "Profile created successfully", [
                    { text: "OK", onPress: () => router.replace("/(tabs)") },
                ]);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to save profile. Please try again.");
        }
    };

    if (isLoading && !profile) {
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
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Enter your name"
                        placeholderTextColor="#999"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                {/* Age Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Age *</Text>
                    <TextInput
                        style={[styles.input, errors.age && styles.inputError]}
                        value={formData.age}
                        onChangeText={(text) => setFormData({ ...formData, age: text })}
                        placeholder="Enter your age"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />
                    {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
                </View>

                {/* Gender Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            mode="dropdown"
                        >
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                </View>

                {/* Health Issue Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Health Issue</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.healthIssue}
                        onChangeText={(text) => setFormData({ ...formData, healthIssue: text })}
                        placeholder="e.g., Hypertension, Diabetes"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Language Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Language Preference</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.languagePreference}
                            onValueChange={(value) => setFormData({ ...formData, languagePreference: value as "en" | "ta" })}
                            style={styles.picker}
                        >
                            <Picker.Item label="English" value="en" />
                            <Picker.Item label="தமிழ் (Tamil)" value="ta" />
                        </Picker>
                    </View>
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
                            <Text style={styles.submitButtonText}>
                                {profile ? "Update Profile" : "Create Profile"}
                            </Text>
                        </>
                    )}
                </Pressable>

                {/* Cancel Button */}
                <Pressable
                    style={styles.cancelButton}
                    onPress={() => {
                        if (profile) {
                            router.back();
                        } else {
                            Alert.alert(
                                "Profile required",
                                "Please create your profile to continue using the app."
                            );
                        }
                    }}
                >
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
        height: 80,
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
