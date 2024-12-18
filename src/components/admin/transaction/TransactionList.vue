<template>
  <div class="order">
    <!--<h2 class="order-title">Order</h2>-->
    <div class="order-list">
      <div class="header">
        <h2>Order List</h2>
        <div class="search">
          <input
            type="search"
            class="form-control rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
          />
        </div>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Stakeholder</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th class="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.order_id">
              <td>{{ order.order_id }}</td>
              <td>{{ order.User?.username }}</td>
              <td>{{ order.Master_Data?.product_name }}</td>
              <td>{{ order.quantity }}</td>
              <td>{{ order.total?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</td>
              <td>{{ order.created_at?.split('T')[0] }}</td>
              <td>{{ order.status }}</td>
              <td class="action-buttons">
                <button class="verif-btn" @click="openModal(order)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <!-- <button class="delete-btn" @click="deleteOrder(order.order_id)">
                  <i class="fa-solid fa-trash"></i>
                </button> -->
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
      <form @submit.prevent="updateStatus">
        <h3>Update Status</h3>
        <div class="status-dropdown">
          <select v-model="form.status" required>
            <option selected>{{ form.status }}</option>
            <option value="PENDING">Pending</option>
            <option value="ON_PROCESS">On Process</option>
            <option value="DONE">Done</option>
            <option value="REJECT">Reject</option>
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
import { useOrderStore } from "@/store/orderStore"

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
      currentPage: 1,
      ordersPerPage: 5,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.orders.length / this.ordersPerPage);
    },

    paginatedOrders() {
      const start = (this.currentPage - 1) * this.ordersPerPage;
      const end = start + this.ordersPerPage;
      return this.orders.slice(start, end);
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
      if(this.form.status == 'REJECT'){
        console.log(this.form)
        await this.orderStore.rejectOrder(this.form)
      }else {
        await this.orderStore.updateOrder(this.form)
      }
      await this.orderStore.fetchOrdersByUserId()
      this.closeModal();
    },

    deleteOrder(order_id) {
      this.orders = this.orders.filter((order) => order.order_id !== order_id);
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
  font-size: 32px;
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

.delete-btn:hover {
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

.delete-btn {
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

.search {
  width: 50%;
}

.search input::placeholder {
  font-size: 14px;
  color: #cbcbcb;
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
