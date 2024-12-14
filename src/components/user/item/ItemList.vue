<template>
  <div class="product">
    <!--<h2 class="product-title">Product</h2>-->
    <div class="product-list">
      <div class="header">
        <h2>Product List</h2>
        <div class="search">
          <input
            type="search"
            class="form-control rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
            v-model="searchQuery"
          />
        </div>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product ID</th>
              <th @click="sortTable('product_name')">
                Product Name
                <span
                  v-if="sortKey === 'product_name'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th @click="sortTable('price')">
                Price
                <span
                  v-if="sortKey === 'price'"
                  :class="{
                    'fa-solid fa-sort-up sort-icon': sortDirection === 'asc',
                    'fa-solid fa-sort-down sort-icon': sortDirection === 'desc',
                    'fa-solid fa-sort sort-icon': sortDirection === '',
                  }"
                ></span>
                <span v-else class="fa-solid fa-sort sort-icon"></span>
              </th>
              <th @click="sortTable('Quantity[0].quantity_of_product')">
                Stock
                <span
                  v-if="sortKey === 'Quantity[0].quantity_of_product'"
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
            <tr
              v-for="(product, index) in paginatedProducts"
              :key="product.product_id"
            >
              <td>{{ (currentPage - 1) * productsPerPage + index + 1 }}</td>
              <td>{{ product.product_id }}</td>
              <td>{{ product.product_name }}</td>
              <td>{{ product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</td>
              <td>{{ product.Quantity[0]?.quantity_of_product }}</td>
              <td class="d-flex justify-content-center">
                <button class="submit-btn" @click="showAddForm(product)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <nav aria-label="page-navigation-table">
          <ul class="pagination">
            <div class="items-per-page">
              <label for="itemsPerPage">Items per page: </label>
              <select v-model="productsPerPage" id="itemsPerPage">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="10">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <li class="page-product" :class="{ disabled: currentPage === 1 }">
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
              class="page-product"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>-->
            <li
              class="page-product"
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
          <ItemForm
            :product="selectedproduct"
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
import { useProductStore } from "@/store/itemStore";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal.vue";
import ItemForm from "@/components/user/item/ItemForm.vue";
import eventBus from "@/utils/EventBus";
import { useOrderStore } from "@/store/orderStore";

export default {
  components: {
    Modal,
    ItemForm,
  },

  setup() {
    let productStore = useProductStore();
    let authStore = useAuthStore();
    let products = computed(() => productStore.products);
    let orderStore = useOrderStore();

    onMounted(() => {
      if (authStore.token) {
        productStore.fetchProducts();
      } else {
        console.error("Product is not authenticated");
      }
    });

    return {
      products,
      productStore,
      orderStore,
      addProduct: productStore.addProduct,
    };
  },

  data() {
    return {
      showForm: false,
      selectedproduct: null,
      currentPage: 1,
      productsPerPage: 5,
      searchQuery: "",
      sortKey: "",
      sortDirection: "asc",
    };
  },

  computed: {
    paginatedProducts() {
      let filteredProducts = this.products.filter((product) =>
        product.product_name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );

      if (this.sortKey) {
        filteredProducts.sort((a, b) => {
          let aValue = this.getValueByKey(a, this.sortKey);
          let bValue = this.getValueByKey(b, this.sortKey);

          if (this.sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      return filteredProducts.slice(
        (this.currentPage - 1) * this.productsPerPage,
        this.currentPage * this.productsPerPage
      );
    },

    totalStock() {
      return this.products.reduce((sum, product) => {
        // Gunakan jumlah stok yang relevan, misalnya:
        return sum + (product.Quantity[0]?.quantity_of_product || 0);
      }, 0);
    },

    totalPages() {
      return Math.ceil(
        this.products.filter((product) =>
          product.product_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        ).length / this.productsPerPage
      );
    },
  },

  methods: {
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

    showAddForm(product) {
      this.selectedproduct = {
        ...product,
      };
      this.isEdit = false;
      this.showForm = true;
    },

    async handleSubmit(product) {
      await this.orderStore.addOrder(product);
      await this.productStore.fetchProductsByUserId(); // Fetch latest users
      this.showForm = false;
    },

    cancelEditForm() {
      this.showForm = false;
    },

    async deleteProduct(product_id) {
      await this.productStore.deleteProduct(product_id); // Memanggil action 'deleteproduct' dari store
      await this.productStore.fetchProductsByUserId(); // Fetch latest users
    },

    handleSearch(query) {
      this.searchQuery = query;
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
.product {
  padding: 20px;
}

.product-title {
  font-size: 32px;
  font-weight: bold;
  color: #736efe;
}

.product-list {
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

.sort-icon {
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 10px;
}

.sort-icon:hover {
  color: #cbcbcb;
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
  background-color: #dadada;
}

button {
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
}

.edit-btn:hover {
  background-color: #bca052;
}

.delete-btn:hover {
  background-color: #bb3232;
}

.icon {
  margin-right: 8px;
  font-size: 14px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.edit-btn {
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

.pagination {
  justify-content: flex-end;
  margin-top: 20px;
}

.page-product {
  margin-left: 5px;
}

.page-link {
  color: #736efe; /* Warna teks ungu untuk semua halaman */
  background-color: transparent; /* Menghilangkan background default */
  border: 1px solid #736efe; /* Border ungu untuk halaman */
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600px;
  border-radius: 6px;
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
