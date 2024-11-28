<template>
  <div>
    <h3>{{ isEdit ? "Edit User" : "Add User" }}</h3>
    <form @submit.prevent="submitForm" class="user-form">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>

        <input
          type="text"
          v-model="form.username"
          id="username"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>

        <input
          type="email"
          v-model="form.email"
          id="email"
          class="form-control"
          required
        />
      </div>

      <div v-if="!isEdit" class="mb-3">
        <label for="password" class="form-label">Password</label>

        <input
          type="password"
          v-model="form.password"
          id="password"
          class="form-control"
          required
        />
      </div>

      <div v-if="!isEdit" class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>

        <input
          type="password"
          v-model="form.confirmPassword"
          id="confirmPassword"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="role" class="form-label">Role</label>
        <select v-model="form.role" id="role" class="form-select" required>
          <option value="SUPPLIER">SUPPLIER</option>
          <option value="STAKEHOLDER">SUPPLIER</option>
        </select>
      </div>

      <div v-if="form.error" class="alert alert-danger">{{ form.error }}</div>

      <button type="submit" class="btn btn-success w-100">
        {{ isEdit ? "Save" : "Save" }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },

    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STAKEHOLDER",
        error: "",
      },
    };
  },

  watch: {
    user: {
      immediate: true,

      handler(newUser) {
        if (this.isEdit) {
          this.form = {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },

  methods: {
    resetForm() {
      this.form = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STAKEHOLDER",
        error: "",
      };
    },

    async submitForm() {
      try {
        if (!this.isEdit) {
          if (this.form.password !== this.form.confirmPassword) {
            this.form.error = "Passwords do not match";

            return;
          }
        }

        this.form.error = "";

        const payload = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          role: this.form.role,
        };

        console.log("Sending data to server:", payload);

        if (this.isEdit) {
          await axios.patch(`/users/${this.user.id}`, payload);
        } else {
          const response = await axios.post("/users", payload);
          console.log("User created:", response.data);
        }

        this.$emit("submit", this.form);

        this.resetForm();
      } catch (error) {
        console.error("Failed to submit form:", error);
        this.form.error = "Failed to submit form: " + error.message;
      }
    },
  },
};
</script>

<style scoped>
form {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.mb-3 {
  margin-bottom: 1rem;
}

.form-control {
  border-radius: 4px;
  border: 1px solid #cbcbcb;
  color: #4b3f6b;
  font-size: 14px;
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
  gap: 10px;
  margin: 20px 20px;
}

.btn-success {
  background-color: #736efe;
  border-color: #736efe;
  color: white;
  width: 80px; /* Ukuran tombol */
  height: 40px;
  font-size: 14px;
}

.btn-success:hover {
  background-color: #615dd7;
  border-color: #615dd7;
}

.btn-secondary {
  background-color: #fe6e70;
  border-color: #fe6e70;
  color: white;
  width: 120px; /* Ukuran tombol */
  height: 40px;
  font-size: 14px;
}

.btn-secondary:hover {
  background-color: #bb3232;
  border-color: #bb3232;
}

h3 {
  color: #736efe;
  font-weight: bold;
  margin: 20px;
  font-size: 24px;
}
</style>
