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
              <td>{{ label.quantity }}</td>
              <td>{{ label.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</td>
              <td>{{ label.created_at.split('T')[0] }}</td>
              <td>{{ label.status }}</td>
              <td class="action-buttons">
                <!--<button class="verif-btn" @click="openModal(label)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>-->
                <button
                  class="update-btn"
                  @click="updateLabel(label.id)"
                >
                  <i class="fa-solid fa-trash"></i>
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
import Modal from "@/components/Modal.vue"; // Impor modal baru
import TransactionForm from "./LabelForm.vue";
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import eventBus from "@/utils/EventBus";
import { useLabelStore } from "@/store/labelStore";

export default {
  components: {
    Modal,
    TransactionForm
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
      isModalVisible: false,
      form: {
        id: "",
        status: "",
      },
      currentPage: 1,
      labelsPerPage: 5,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.labels.length / this.labelsPerPage);
    },

    paginatedLabels() {
      const start = (this.currentPage - 1) * this.labelsPerPage;
      const end = start + this.labelsPerPage;
      return this.labels.slice(start, end);
    },
  },

  methods: {
    openModal(label) {
      if (this.form.id !== label.id) {
        this.form = { ...label };
        this.isModalVisible = true;
      }
    },

    closeModal() {
      this.isModalVisible = false;
      this.form = { id: "", status: "" };
    },

    // updateStatus() {
    //   const index = this.labels.findIndex(
    //     (label) => label.id === this.form.id
    //   );
    //   if (index !== -1) {
    //     this.labels[index].status = this.form.status;
    //   }
    //   this.closeModal();
    // },

    updateLabel(id) {
      this.labels = this.labels.filter(
        (label) => label.id !== id
      );
    },

    // goToLabelForm() {
    //   this.$router.push("/labels/new");
    // },

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

h3 {
  color: #736efe;
  font-weight: bold;
  margin: 20px;
  font-size: 32px;
}

.label-title {
  font-size: 32px;
  font-weight: bold;
  color: #736efe;
}

.label-list {
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

.search input::placeholder {
  font-size: 14px;
  color: #cbcbcb;
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
  border-top: 0.5px solid #cbcbcb;
  border-bottom: 0.5px solid #cbcbcb;
  padding: 12px 15px;
  text-align: center;
  vertical-align: middle;
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

.btn-success {
  background-color: #736efe;
  border-color: #736efe;
  color: white;
  width: 120px;
  height: 40px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 20px;
}

.btn-success:hover {
  background-color: #615dd7;
  border-color: #615dd7;
}

.verif-btn:hover {
  background-color: #bca052;
}

.update-btn:hover {
  background-color: #bb3232;
}

.icon {
  margin-right: 8px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.verif-btn {
  color: #fed86e;
  background-color: #fff4d5;
  border-radius: 10px;
  font-size: 14px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

.update-btn {
  color: #fe6e70;
  background-color: #ffdfdf;
  border-radius: 10px;
  font-size: 14px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dropdown {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.status-dropdown select {
  margin: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  height: 40px;
}

.status-dropdown button {
  padding: 6px 12px;
  background-color: #736efe;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.status-dropdown button:hover {
  background-color: #615dd7;
}

.pagination {
  justify-content: flex-end;
  margin-top: 20px;
}

.page-item {
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

.page-link:hover {
  background-color: #615dd7;
  color: white;
}

.page-item.active .page-link {
  background-color: #736efe;
  color: white;
  border: 1px solid #736efe;
}

.page-item.disabled .page-link {
  color: #cbcbcb;
  border: 1px solid #cbcbcb;
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
