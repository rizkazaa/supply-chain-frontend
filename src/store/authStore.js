import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    username: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    password: "", // Tidak direkomendasikan menyimpan password di localStorage
  }),

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    setRole(role) {
      this.role = role;
      localStorage.setItem("role", role);
    },

    setUserData({ username, email, password }) {
      this.username = username;
      this.email = email;
      this.password = password || ""; // Default jika password tidak disimpan
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
    },

    logout() {
      this.token = "";
      this.role = "";
      this.username = "";
      this.email = "";
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
    },
  },
});
