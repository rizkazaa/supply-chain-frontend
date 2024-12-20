<template>
  <div class="profile">
    <div class="profile-card">
      <div class="header">
        <h2>Edit Profile</h2>
      </div>
      <form @submit.prevent="updateProfile">
        <div class="form-row">
          <div class="form-group">
            <label for="username" class="form-label">Username:</label>
            <input
              type="text"
              v-model="form.username"
              id="username"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="userEmail" class="form-label">Email:</label>
            <input
              type="email"
              v-model="form.email"
              id="userEmail"
              class="form-control"
              required
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="password" class="form-label">Password:</label>
            <input
              type="password"
              v-model="form.password"
              id="password"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="role" class="form-label">Role:</label>
            <input
              type="role"
              v-model="form.role"
              id="password"
              class="form-control"
              disabled
            />
          </div>
        </div>
        <div class="button-container">
          <button
            type="submit"
            class="btn-success"
            @click.prevent="updateProfile"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";

export default {
  setup() {
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    const profiles = computed(() => profileStore.profiles);

    onMounted(() => {
      if (authStore.token) {
        profileStore.fetchProfile();
      } else {
        console.error("User is not authenticated");
      }
    });

    return {
      profiles,
      profileStore,
    };
  },

  computed: {
    form() {
      return {
        username: this.profiles.username,
        email: this.profiles.email,
        password: "",
        role: this.profiles.role,
        category: this.profiles.category,
      };
    },
  },

  methods: {
    async updateProfile() {
      console.log(this.form);
      await this.profileStore.updateProfile(this.form);
      await this.profileStore.fetchProfile(); // Fetch latest user profile
      alert("Profile updated successfully!");
    },
    logout() {
      this.authStore.logout();
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-title {
  font-size: 32px;
  font-weight: bold;
  color: #736efe;
}

.profile-card {
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  color: #736efe;
  font-size: 24px;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  margin-right: 20px;
}

.form-group:last-child {
  margin-right: 0;
}

.form-control {
  border-radius: 4px;
  border: 1px solid #cbcbcb;
}

.form-control:focus {
  border-color: #4b3f6b;
  box-shadow: 0 0 0 0.2rem rgba(75, 63, 107, 0.25);
}

.form-label {
  font-weight: bold;
  color: #736efe;
  font-size: 14px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin: 20px 20px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-success {
  background-color: #736efe;
  border-color: #736efe;
  color: white;
  width: 150px;
  height: 40px;
  padding: 10px 20px;
  margin-top: 20px;
  font-weight: 600;
}

.btn-success:hover {
  background-color: #615dd7;
  border-color: #615dd7;
}

.change-password-button {
  margin-left: 10px;
  background-color: #736efe;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.change-password-button:hover {
  background-color: #615dd7;
}

.password-group {
  display: flex;
  align-items: center;
}

.logout-button {
  margin-top: 10px;
  background-color: #ff4d4d;
  color: white;
  font-weight: 600;
}

.logout-button:hover {
  background-color: #ff1a1a;
}

@media (max-width: 600px) {
  .profile-card {
    padding: 15px;
  }

  input {
    padding: 8px;
  }

  button {
    padding: 8px;
  }

  .form-row {
    flex-direction: column;
  }

  .form-group {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
