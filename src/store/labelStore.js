import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";

export const useLabelStore = defineStore("labelStore", {
  state: () => ({
    labels: [], // Menyimpan daftar labels
  }),
  actions: {
    // Fetch labels berdasarkan ID user (misalnya, jika labels terkait dengan user tertentu)
    async fetchLabelsByUserId() {
      try {
        const response = await apiClient.get(`/labels`);
        this.labels = response.data;
      } catch (error) {
        console.error(
          "Failed to fetch labels by user ID:",
          error.response?.data || error.message
        );
      }
    },
  },
  persist: true, // Menyimpan state agar tetap ada saat aplikasi di-reload
});
