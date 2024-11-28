<template>
  <div class="user-card">
    <div class="card-header">
      <h3>{{ user.username }}</h3>
      <span :class="['role', user.role.toLowerCase()]">{{ user.role }}</span>
    </div>
    <div class="card-body">
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <div class="card-footer">
      <button class="edit-btn" @click="editUser">Edit</button>
      <button class="delete-btn" @click="deleteUser">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    user: Object,
  },
  methods: {
    editUser() {
      this.$emit("edit-user", this.user);
    },
    deleteUser() {
      this.$emit("delete-user", this.user.id);
    },
  },
};
</script>

<style scoped>
.user-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  color: #35c88d;
  font-size: 20px;
}

.card-body {
  margin-top: 12px;
}

.card-footer {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.edit-btn {
  background-color: #fed86e;
  color: white;
}

.edit-btn:hover {
  background-color: #bca052;
}

.delete-btn {
  background-color: #df3636;
  color: white;
}

.delete-btn:hover {
  background-color: #bb3232;
}

.role {
  padding: 4px 8px;
  border-radius: 4px;
}

.role.admin {
  background-color: #ff6347;
  color: white;
}

.role.user {
  background-color: #35c88d;
  color: white;
}
</style>
