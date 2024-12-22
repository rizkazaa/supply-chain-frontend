<template>
  <div class="order">
    <!--<h2 class="order-title">Order</h2>-->
    <div class="order-list">
      <div class="header">
        <h2>Order List</h2>
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
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th @click="sortTable('User.username')">
                Stakeholder
                <span
                  v-if="sortKey === 'User.username'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th @click="sortTable('Master_Data.product_name')">
                Product Name
                <span
                  v-if="sortKey === 'Master_Data.product_name'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th @click="sortTable('quantity')">
                Quantity
                <span
                  v-if="sortKey === 'quantity'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th @click="sortTable('total')">
                Amount
                <span
                  v-if="sortKey === 'total'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th @click="sortTable('created_at')">
                Date
                <span
                  v-if="sortKey === 'created_at'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th @click="sortTable('status')">
                Status
                <span
                  v-if="sortKey === 'status'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th class="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in paginatedOrders" :key="order.order_id">
              <td>{{ (currentPage - 1) * ordersPerPage + index + 1 }}</td>
              <td>{{ order.order_id }}</td>
              <td>{{ order.User?.username }}</td>
              <td>{{ order.Master_Data?.product_name }}</td>
              <td>{{ order.quantity }}</td>
              <td>
                {{
                  order.total?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }}
              </td>
              <td>{{ order.created_at?.split("T")[0] }}</td>
              <td>
                <span
                  :class="{
                    'rejected-status': order.status === 'REJECT',
                    'done-status': order.status === 'DONE',
                    'on-process-status': order.status === 'ON_PROCESS',
                    'pending-status': order.status === 'PENDING',
                  }"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="verif-btn" @click="openModal(order)">
                  <i class="fa-solid fa-pen-to-square icon"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <nav aria-label="page-navigation-table">
          <ul class="pagination">
            <div class="items-per-page">
              <label for="itemsPerPage">Items per page: </label>
              <select v-model="ordersPerPage" id="itemsPerPage">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <li class="page-order" :class="{ disabled: currentPage === 1 }">
              <a
                class="page-link"
                href="#"
                @click.prevent="changePage(currentPage - 1)"
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <!--<li
              v-for="page in totalPages"
              :key="page"
              class="page-order"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>-->
            <li
              class="page-order"
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
      <form @submit.prevent="updateStatus">
        <h3>Update Status</h3>
        <div class="status-dropdown">
          <select v-model="form.status" required>
            <option selected>{{ form.status }}</option>
            <option value="PENDING">PENDING</option>
            <option value="ON_PROCESS">On Process</option>
            <option value="DONE">DONE</option>
            <option value="REJECT">REJECT</option>
          </select>
        </div>
        <div class="button-container">
          <button type="submit" class="btn-success">Update</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue"; // Impor modal baru
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import eventBus from "@/utils/EventBus";
import { useOrderStore } from "@/store/orderStore";

export default {
  components: {
    Modal,
  },

  setup() {
    let authStore = useAuthStore();
    let orderStore = useOrderStore();
    let orders = computed(() => orderStore.orders);

    onMounted(() => {
      if (authStore.token) {
        orderStore.fetchOrdersByUserId();
      } else {
        console.error("Orders is not authenticated");
      }
    });

    return {
      orders,
      orderStore,
    };
  },

  data() {
    return {
      isModalVisible: false,
      form: {
        order_id: "",
        status: "",
      },
      searchQuery: "",
      currentPage: 1,
      ordersPerPage: 5,
      sortKey: "",
      sortDirection: "asc",
    };
  },

  computed: {
    paginatedOrders() {
      let filteredOrders = this.orders.filter((order) =>
        order.Master_Data?.product_name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );

      if (this.sortKey) {
        filteredOrders.sort((a, b) => {
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

      return filteredOrders.slice(
        (this.currentPage - 1) * this.ordersPerPage,
        this.currentPage * this.ordersPerPage
      );
    },

    totalPages() {
      return Math.ceil(
        this.orders.filter((order) =>
          order.Master_Data?.product_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        ).length / this.ordersPerPage
      );
    },
  },

  methods: {
    openModal(order) {
      if (this.form.order_id !== order.order_id) {
        this.form = { ...order };
        // console.log(this.form)
        this.isModalVisible = true;
      }
    },

    closeModal() {
      this.isModalVisible = false;
      this.form = { order_id: "", status: "" };
    },

    async updateStatus() {
      if (this.form.status == "REJECT") {
        console.log(this.form);
        await this.orderStore.rejectOrder(this.form);
      } else {
        await this.orderStore.updateOrder(this.form);
      }
      await this.orderStore.fetchOrdersByUserId();
      this.closeModal();
    },

    deleteOrder(order_id) {
      this.orders = this.orders.filter((order) => order.order_id !== order_id);
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
.order {
  padding: 20px;
}

h3 {
  color: #736efe;
  font-weight: bold;
  margin: 20px;
  font-size: 24px;
}

.order-title {
  font-size: 32px;
  font-weight: bold;
  color: #736efe;
}

.order-list {
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

.sort-icon {
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 10px;
}

.sort-icon:hover {
  color: #cbcbcb;
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

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.verif-btn {
  color: #fed86e;
  background-color: #fff4d5;
  border-radius: 10px;
  font-size: 14px;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
}

.rejected-status {
  color: #fe6e70;
  background-color: #ffdfdf;
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

.pending-status {
  color: #f79c42;
  background-color: #ffddba;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px 12px;
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

.page-order {
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

.page-order.active .page-link {
  background-color: #736efe;
  color: white;
  border: 1px solid #736efe;
}

.page-order.disabled .page-link {
  color: #cbcbcb;
  border: 1px solid #cbcbcb;
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
