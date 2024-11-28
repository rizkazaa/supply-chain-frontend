<template>
  <div class="register-form">
    <h3>Register</h3>

    <form @submit.prevent="register">
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
          type="email"
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

      <div class="mb-3">
        <label for="confirm-password" class="form-label"
          >Confirm Password</label
        >

        <input
          type="password"
          id="confirm-password"
          v-model="confirmPassword"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-success w-100">Register</button>
    </form>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

    <div class="mt-3 text-center">
      <p class="text-muted">
        Already have an account?

        <a
          href="#"
          @click.prevent="$emit('switch', 'Login')"
          class="text-custom"
        >
          Login here
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { register as registerService } from "@/services/authService";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: "",
    };
  },

  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await registerService(
          this.username,
          this.email,
          this.password
        );

        console.log("Registration successful:", response);
        alert("Registration successful!");

        this.$emit("switch", "Login");
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message || "Invalid request";
        } else {
          this.error = error.message || "An unexpected error occurred";
        }
        console.error("Registration failed:", error.message);
        alert("Registration failed!");
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
.btn-success {
  background-color: #736efe;
  border-color: #736efe;
}

.btn-success:hover {
  background-color: #5b4ddf;
  border-color: #5b4ddf;
}
</style>
