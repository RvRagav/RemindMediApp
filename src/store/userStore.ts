import { create } from 'zustand';
import { userRepository } from '../database/repositories';
import { UserProfile } from '../types';

interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProfile: () => Promise<void>;
    createProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    setLanguage: (language: 'en' | 'ta') => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profile = await userRepository.getProfile();
            set({ profile, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch profile',
                isLoading: false
            });
        }
    },

    createProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
            const profile = await userRepository.createProfile(profileData);
            set({ profile, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create profile',
                isLoading: false
            });
            throw error;
        }
    },

    updateProfile: async (updates) => {
        const { profile } = get();
        if (!profile) {
            set({ error: 'No profile to update' });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            await userRepository.updateProfile(profile.id, updates);
            await get().fetchProfile();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update profile',
                isLoading: false
            });
            throw error;
        }
    },

    setLanguage: async (language) => {
        await get().updateProfile({ languagePreference: language });
    },
}));
