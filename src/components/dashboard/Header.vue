<template>
  <header :class="{ expanded: !isSidebarVisible }">
    <button class="toggle-btn" @click="toggleSidebar">☰</button>
    <div class="header-content">
      <div class="role-selection">
        <div class="dropdown-container">
          <button
            class="for-dropdown role-button"
            @click="toggleDropdown('roleDropdown')"
          >
            <i class="fa-solid fa-circle-user"></i>
          </button>
          <div v-if="roleDropdownVisible" class="section-dropdown">
            <button class="role-selection" @click="selectRole('supplier')">
              Supplier
            </button>
            <button class="role-selection" @click="selectRole('stakeholder')">
              Stakeholder
            </button>
            <button class="logout-button" @click="confirmLogout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { EventBus } from "@/utils/EventBus";

export default {
  props: {
    currentRole: {
      type: String,
      required: true,
    },
    isSidebarVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      roleDropdownVisible: false,
      logoutDropdownVisible: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    toggleDropdown(dropdown) {
      if (dropdown === "roleDropdown") {
        this.roleDropdownVisible = !this.roleDropdownVisible;
        this.logoutDropdownVisible = false; // Close other dropdown
      }
    },
    selectRole(role) {
      this.$emit("update-role", role);
      const authRole = localStorage.getItem("role");
      const isAuthenticated = Boolean(localStorage.getItem("auth"));

      if (isAuthenticated && authRole === role) {
        this.$router.push({ name: role, params: { component: "items" } });
      } else {
        alert("You do not have permission to switch to this role.");
        this.logout();
      }
    },
    confirmLogout() {
      alert("You have been logged out.");
      this.logout();
    },
    logout() {
      localStorage.removeItem("auth");
      localStorage.removeItem("role");
      this.$emit("update-role", "supplier");
      this.$emit("toggle-sidebar", false);
      this.$router.push({ name: "login" });
    },
    emitSearch() {
      EventBus.emit("search", this.search);
    },
  },
};
</script>

<style scoped>
header {
  background-color: #ffffff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  height: 60px;
  width: calc(100% - 180px);
  position: fixed;
  top: 0;
  left: 200px;
  z-index: 1000;
  transition: width 0.3s ease, left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header.expanded {
  width: 100%;
  left: 0;
}

.toggle-btn {
  background: none;
  border: none;
  color: #736efe;
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
}

.header-content {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 100%;
  align-items: center;
}

.dropdown-container {
  position: relative;
}

.for-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: none;
  font-size: 14px;
}

.role-button {
  color: #736efe;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.logout-button {
  color: #ff6b6b;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.role-selection {
  color: #736efe;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.section-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #cbcbcb;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.section-dropdown button {
  width: 100%;
  padding: 10px 15px;
  border: none;
  background-color: transparent;
  text-align: left;
  cursor: pointer;
}

.section-dropdown button:hover {
  background-color: #ddd;
}

@media (max-width: 768px) {
  header {
    width: 100%;
    left: 0;
  }

  .header-content {
    flex-direction: column;
  }
}
</style>
