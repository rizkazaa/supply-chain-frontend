<template>
  <div class="label">
    <!--<h2 class="label-title">Label</h2>-->
    <div class="label-list">
      <div class="header">
        <h2>Label List</h2>
        <div class="search">
          <input
            type="search"
            class="form-control rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
          />
        </div>
        <!-- <button class="add-btn" @click="goToLabelForm">
          <i class="fa-solid fa-plus icon"></i> New Label
        </button> -->
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th class="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="label in paginatedLabels" :key="label.id">
              <td>{{ label.label_id }}</td>
              <td>{{ label.Master_Data?.product_name }}</td>
              <td>{{ label.Order?.quantity }}</td>
              <td>
                {{
                  label.Order?.total.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }}
              </td>
              <td>{{ label.created_at.split("T")[0] }}</td>
              <td>
                <span
                  :class="{
                    'done-status': label.Order?.status === 'DONE',
                    'on-process-status': label.Order?.status === 'ON_PROCESS',
                  }"
                  >{{ label.Order?.status }}</span
                >
              </td>
              <td>
                <!--<button class="verif-btn" @click="openModal(label)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>-->
                <button class="verif-btn" @click="openModal(label)">
                  <i class="fa-solid fa-print icon"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <nav aria-label="page-navigation-table">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
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
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
            <li
              class="page-item"
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
    </div>

    <Modal :visible="isModalVisible" :title="'Edit Status'" @close="closeModal">
      <LabelForm :label="selectedLabel" :isCompact="true" />
      <!-- <form @submit.prevent="updateStatus">
        <h3>Update Status</h3>
        <div class="status-dropdown">
          <select v-model="form.status" required>
            <option value="Pending">Pending</option>
            <option value="On Process">On Process</option>
            <option value="Done">Done</option>
            <option value="Reject">Reject</option>
          </select>
        </div>
        <div class="button-container">
          <button type="submit" class="btn-success">Update</button>
        </div>
      </form> -->
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import LabelForm from "@/components/user/label/LabelForm.vue";
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import eventBus from "@/utils/EventBus";
import { useLabelStore } from "@/store/labelStore";

export default {
  components: {
    Modal,
    LabelForm,
  },

  setup() {
    let authStore = useAuthStore();
    let labelStore = useLabelStore();
    let labels = computed(() => labelStore.labels);

    onMounted(() => {
      if (authStore.token) {
        labelStore.fetchLabels();
      } else {
        console.error("Labels is not authenticated");
      }
    });

    return {
      labels,
      labelStore,
    };
  },

  data() {
    return {
      selectedLabel: null,
      isModalVisible: false,
      currentPage: 1,
      labelsPerPage: 5,
      searchQuery: "",
      sortKey: "",
      sortDirection: "asc",
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(
        this.labels.filter((label) =>
          label.Master_Data?.product_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        ).length / this.labelsPerPage
      );
    },

    paginatedLabels() {
      let filteredLabels = this.labels.filter((label) =>
        label.Master_Data?.product_name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );

      if (this.sortKey) {
        filteredLabels.sort((a, b) => {
          let aValue = this.getValueByKey(a, this.sortKey) || ""; // Pastikan nilai tidak undefined
          let bValue = this.getValueByKey(b, this.sortKey) || ""; // Pastikan nilai tidak undefined

          if (typeof aValue === "string") aValue = aValue.toLowerCase();
          if (typeof bValue === "string") bValue = bValue.toLowerCase();

          if (this.sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      return filteredLabels.slice(
        (this.currentPage - 1) * this.labelsPerPage,
        this.currentPage * this.labelsPerPage
      );
    },

    totalPages() {
      return Math.ceil(
        this.labels.filter((label) =>
          label.Master_Data?.product_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        ).length / this.labelsPerPage
      );
    },
  },

  methods: {
    openModal(label) {
      this.selectedLabel = { ...label };
      this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
      this.selectedLabel = null;
    },

    getValueByKey(obj, key) {
      return key
        .split(/[\[\]\.]+/)
        .reduce((o, k) => (o ? o[k] : undefined), obj);
    },

    sortTable(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDirection = "asc";
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
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
.label {
  padding: 20px;
}

.label-container,
.label-label {
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.label-title {
  font-size: 32px;
  font-weight: bold;
  color: #736efe;
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

table {
  width: 100%;
  border-collapse: collapse;
}

.sort-icon {
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 10px;
}

.sort-icon:hover {
  color: #cbcbcb;
}

th,
td {
  border-top: 0.5px solid #cbcbcb;
  border-bottom: 0.5px solid #cbcbcb;
  padding: 12px 15px;
  text-align: center;
  font-size: 14px;
}

th {
  background-color: #736efe;
  color: white;
  font-size: 14px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #cbcbcb;
}

button {
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
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
  width: 120px;
  height: 40px;
}

.btn-success:hover {
  background-color: #615dd7;
  border-color: #615dd7;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.verif-btn {
  color: #77a4ff;
  background-color: #dfeaff;
  border-radius: 10px;
  font-size: 14px;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
}

.verif-btn:hover {
  background-color: #6389d6;
}

.done-status {
  color: #63d18b;
  background-color: #d5ffe2;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.on-process-status {
  color: #77a4ff;
  background-color: #dfeaff;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination {
  justify-content: flex-end;
  margin-top: 20px;
}

.page-label {
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
  border-color: #736efe;
  outline: none;
}

.items-per-page select option {
  padding: 10px;
  font-size: 14px;
}

.page-link:hover {
  background-color: #615dd7;
  color: white;
}

.page-label.active .page-link {
  background-color: #736efe;
  color: white;
  border: 1px solid #736efe;
}

.page-label.disabled .page-link {
  color: #cbcbcb;
  border: 1px solid #cbcbcb;
}

@media (max-width: 600px) {
  th,
  td {
    padding: 8px 10px;
  }

  .verif-btn {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
}
</style>