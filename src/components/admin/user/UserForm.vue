<template>
  <div>
    <h3>{{ isEdit ? "Edit User" : "Add User" }}</h3>
    <form @submit.prevent="submitForm" class="user-form">
      <input
        type="text"
        v-model="form.user_id"
        id="user_id"
        class="form-control"
        hidden
      />

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

      <div class="mb-3">
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
          <option value="STAKEHOLDER">STAKEHOLDER</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Category</label>

        <input
          type="text"
          v-model="form.category"
          id="category"
          class="form-control"
          :disabled="form.role == 'STAKEHOLDER'"
          required
        />
      </div>

      <div v-if="form.error" class="alert alert-danger">{{ form.error }}</div>
      <div class="button-container">
        <button type="submit" class="btn btn-success">
          {{ isEdit ? "Save" : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
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
        user_id: 0,
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        category: "",
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
            user_id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            category: newUser.category ? newUser.category : "",
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
        user_id: 0,
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        category: "",
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
          user_id: this.form.user_id,
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          role: this.form.role,
          category: this.form.category ? this.form.category : "",
        };

        console.log("Sending data to server:", payload);
        this.$emit("submit", payload);

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
  margin: 10px;
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
  margin: 20px 20px;
}

.btn-success {
  background-color: #736efe;
  border-color: #736efe;
  color: white;
  width: 120px;
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
  width: 120px;
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