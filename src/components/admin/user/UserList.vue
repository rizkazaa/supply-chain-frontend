<template>
  <div class="user">
    <div class="user-list">
      <div class="header">
        <h2>User List</h2>
        <div class="search">
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
            v-model="searchQuery"
            class="search-input"
          />
        </div>
        <button class="add-btn" @click="showAddForm">
          <i class="fa-solid fa-plus icon-add-user"></i> Add User
        </button>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Category</th>
              <th class="action-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
              <td>{{ (currentPage - 1) * usersPerPage + index + 1 }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.category ? user.category : "-" }}</td>
              <td>
                <button class="edit-btn" @click="editUser(user)" title="Edit">
                  <i class="fa-solid fa-pen-to-square icon"></i>
                </button>
                <button
                  class="delete-btn"
                  @click="handleDeleteUser(user)"
                  title="Delete"
                >
                  <i class="fa-solid fa-trash icon"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <nav aria-label="page-navigation-table">
          <ul class="pagination">
            <div class="items-per-page">
              <label for="itemsPerPage">Items per page: </label>
              <select v-model="usersPerPage" id="itemsPerPage">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <li class="page-user" :class="{ disabled: currentPage === 1 }">
              <a
                class="page-link"
                href="#"
                @click.prevent="changePage(currentPage - 1)"
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li
              class="page-user"
              :class="{ disabled: currentPage === totalPages }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="changePage(currentPage + 1)"
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <Modal :visible="showForm" @close="cancelEditForm">
          <UserForm
            :user="selectedUser"
            :isEdit="isEdit"
            @submit="handleSubmit"
            @cancel="cancelEditForm"
          />
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal.vue";
import UserForm from "@/components/admin/user/UserForm.vue";
import eventBus from "@/utils/EventBus";

export default {
  name: "users",
  components: {
    Modal,
    UserForm,
  },

  setup() {
    const userStore = useUserStore();
    const authStore = useAuthStore();
    const users = computed(() => userStore.users);

    onMounted(() => {
      if (authStore.token) {
        userStore.fetchUsers();
      } else {
        console.error("User is not authenticated");
      }
    });

    return {
      users,
      userStore,
    };
  },

  data() {
    return {
      showForm: false,
      selectedUser: null,
      isEdit: false,
      searchQuery: "",
      currentPage: 1,
      usersPerPage: 5,
    };
  },

  computed: {
    paginatedUsers() {
      let filteredUsers = this.users.filter((user) =>
        user.username?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      return filteredUsers.slice(
        (this.currentPage - 1) * this.usersPerPage,
        this.currentPage * this.usersPerPage
      );
    },

    totalPages() {
      return Math.ceil(
        this.users.filter((user) =>
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        ).length / this.usersPerPage
      );
    },
  },

  methods: {
    showAddForm() {
      this.selectedUser = {
        id: "",
        username: "",
        email: "",
        role: "STAKEHOLDER",
      };
      this.isEdit = false;
      this.showForm = true;
    },

    editUser(user) {
      this.selectedUser = { ...user };
      this.isEdit = true;
      this.showForm = true;
    },

    async handleSubmit(user) {
      if (this.isEdit) {
        await this.userStore.updateUser(user);
      } else {
        await this.userStore.addUser(user);
      }

      await this.userStore.fetchUsers(); // Fetch latest users
      this.showForm = false;
    },

    cancelEditForm() {
      this.showForm = false;
    },

    async handleDeleteUser(user) {
      await this.userStore.deleteUser(user);
      await this.userStore.fetchUsers(user); // Fetch latest users
    },

    handleSearch(query) {
      this.searchQuery = query;
    },
  },

  unmounted() {
    eventBus.on("search", this.handleSearch);
  },

  beforeUnmount() {
    eventBus.off("search", this.handleSearch);
  },
};
</script>

<style scoped>
.user {
  padding: 20px;
}

.user-list {
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
  margin-right: 350px;
}

.search {
  flex: 1;
  width: 100%;
  margin-right: 10px;
}

.search-input::placeholder {
  font-size: 14px;
  color: #cbcbcb;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-btn {
  background-color: #736efe;
  color: white;
  padding: 10px 12px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.add-btn:hover {
  background-color: #615dd7;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  border-top: 0.5px solid #cbcbcb;
  border-bottom: 0.5px solid #cbcbcb;
}

th {
  background-color: #736efe;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

button {
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.edit-btn {
  color: #fed86e;
  background-color: #fff4d5;
  border-radius: 10px;
  font-size: 14px;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

.edit-btn:hover {
  background-color: #bca052;
}

.delete-btn {
  color: #fe6e70;
  background-color: #ffdfdf;
  border-radius: 10px;
  font-size: 14px;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background-color: #bb3232;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-add-user {
  margin-right: 8px;
  font-size: 14px;
  font-weight: 600;
}

.pagination {
  justify-content: flex-end;
  margin-top: 20px;
  gap: 5px;
}

.page-product {
  margin-left: 5px;
}

.page-link {
  color: #736efe;
  background-color: transparent;
  border: 1px solid #736efe;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600px;
  border-radius: 6px;
}

.page-link:focus {
  outline: none;
  box-shadow: none;
}

.items-per-page {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.items-per-page label {
  font-size: 14px;
}

.items-per-page select {
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #736efe;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.items-per-page select:focus {
  border-color: #736efe; /* Green border on focus */
  outline: none;
}

.items-per-page select option {
  padding: 10px;
  font-size: 14px;
}

.page-link:hover {
  background-color: #615dd7; /* Mengubah background menjadi warna lebih gelap saat hover */
  color: white; /* Menjadikan teks putih saat hover */
}

.page-product.active .page-link {
  background-color: #736efe; /* Latar belakang ungu pada halaman yang aktif */
  color: white; /* Teks putih pada halaman aktif */
  border: 1px solid #736efe; /* Border ungu untuk halaman aktif */
}

.page-product.disabled .page-link {
  color: #cbcbcb; /* Warna abu-abu untuk halaman yang dinonaktifkan */
  border: 1px solid #cbcbcb; /* Border abu-abu */
}

@media (max-width: 600px) {
  th,
  td {
    padding: 8px 10px;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons button {
    margin: 5px 0;
  }
}
</style>