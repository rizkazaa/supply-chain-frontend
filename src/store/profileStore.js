import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";

export const useProfileStore = defineStore("profileStore", {
  state: () => ({
    profiles: [],
  }),

  actions: {
    async fetchProfile() {
      try {
        const response = await apiClient.get("/profile");
        this.profiles = response.data;
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    },

    async updateProfile(profile) {
      try {
        const response = await apiClient.patch("/profile", profile);
        const index = this.profiles.findIndex((u) => u.id === profile.id);

        if (index !== -1) {
          this.profiles.splice(index, 1, response.data);
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    },
  },
});
