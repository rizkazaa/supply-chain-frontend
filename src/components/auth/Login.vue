<template>
  <div class="login-form">
    <h3>Login</h3>

    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>

        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>

        <input
          type="text"
          id="email"
          v-model="email"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>

        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-100">Login</button>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </form>

    <div class="mt-3 text-center">
      <p class="text-muted">
        Don't have an account?

        <a
          href="#"
          @click.prevent="$emit('switch', 'Register')"
          class="text-custom"
        >
          Register here
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { login as loginService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      error: "",
    };
  },

  methods: {
    async login() {
      try {
        const { token, role } = await loginService(
          this.username,
          this.email,
          this.password
        );

        const authStore = useAuthStore();

        authStore.setToken(token);
        authStore.setRole(role);

        authStore.setUserData({
          username: this.username,
          email: this.email,
          password: this.password,
        });

        if (role === "STAKEHOLDER") {
          this.$router.push({ name: "stakeholder" });
        } else if (role === "SUPPLIER") {
          this.$router.push({ name: "supplier" });
        }
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
/* Untuk heading */
h3 {
  color: #736efe;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 24px;
}

/* Label untuk form */
.form-label {
  color: #736efe;
  font-size: 14px;
}

/* Inputan form */
.form-control {
  border-radius: 4px;
  border: 1px solid #cbcbcb;
  color: #4b3f6b;
  font-size: 14px;
}

/* Fokus inputan */
.form-control:focus {
  border-color: #4b3f6b;
  box-shadow: 0 0 0 0.2rem rgba(75, 63, 107, 0.25);
}

/* Tombol Register */
.btn-primary {
  background-color: #736efe;
  border-color: #736efe;
}

.btn-primary:hover {
  background-color: #5b4ddf;
  border-color: #5b4ddf;
}
</style>
