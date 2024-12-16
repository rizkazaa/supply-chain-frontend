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
                <button
                    type="button"
                    class="btn-select"
                    @click="addProduct(product)"
                  >
                  Add
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

          <div class="order-form">
        <div class="mb-3" v-if="selectedProducts.length">
          <div class="selected">
            <h2>Selected Order</h2>
          </div>
          <table class="selected-products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(product, index) in selectedProducts"
                :key="product.product_id"
              >
                <td>{{ product.product_name }}</td>
                <td>
                  <input
                    type="number"
                    v-model.number="product.quantity"
                    @input="updateTotalPrice"
                    min="1"
                  />
                </td>
                <td>{{ product.quantity * product.price }}</td>
                <td>
                  <button
                    type="button"
                    class="btn-remove"
                    @click="removeProduct(index)"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Total Harga Keseluruhan -->
          <div class="mb-3">
            <div for="total-price" class="form-label">
              Grand Total:
              <p class="form-price">{{ grandTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</p>
            </div>
          </div>
          <div class="button-container">
            <button @click.prevent="submitOrder" class="btn btn-success">Submit</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/store/itemStore";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal.vue";
import ItemForm from "@/components/user/item/ItemForm.vue";
import eventBus from "@/utils/EventBus";
import { useOrderStore } from "@/store/orderStore";

export default {
  setup() {
    const authStore = useAuthStore();
    const orderStore = useOrderStore();
    const productStore = useProductStore();
    const products = ref([]);
    const searchQuery = ref("");
    const selectedProducts = ref([]);

    onMounted(() => {
      if (authStore.token) {
      productStore.fetchProducts();
      products.value = productStore.products;
      } else {
        console.error("Orders is not authenticated");
      }
    });

    const grandTotal = computed(() =>
      selectedProducts.value.reduce(
        (total, product) => total + product.quantity * product.price,
        0
      )
    );

    const filteredProducts = computed(() =>
      products.value.filter((product) =>
        product.product_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    );

    // const fetchProducts = async () => {
    //   await productStore.fetchProducts();
    //   products.value = productStore.products;
    // };

    const addProduct = (product) => {
      const existingProduct = selectedProducts.value.find(
        (p) => p.product_id === product.product_id
      );
      if (existingProduct) {
        alert("This product is already selected.");
        return;
      }
      selectedProducts.value.push({ ...product, quantity: 1 });
    };

    const removeProduct = (index) => {
      selectedProducts.value.splice(index, 1);
    };

    const submitOrder = async () => {
      console.log(selectedProducts.value)
      if (selectedProducts.value.length === 0) {
        alert("Please select at least one product.");
        return;
      }
      const orders = selectedProducts.value.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
        total: product.quantity * product.price,
        category: product.category,
      }));
      // await orderStore.addOrder({ orders });
      alert("Order placed successfully!");
      selectedProducts.value = [];

      console.log(orders)
      for(let order of orders){
          // await productStore.fetchProducts();
        await orderStore.addOrder(order);
      }
      await productStore.fetchProducts(); // Fetch latest users
    };

    const updateTotalPrice = () => {};


    // onMounted(fetchProducts);

    return {
      products,
      filteredProducts,
      selectedProducts,
      grandTotal,
      addProduct,
      removeProduct,
      submitOrder,
      updateTotalPrice,
      currentPage: 1,
      productsPerPage: 10,
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
      return key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
    },

    sortTable(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDirection = "asc";
      }
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
};
</script>

<style scoped>
.order {
  padding: 20px;
}

.order-form {
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

.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  color: #736efe;
  font-size: 24px;
  font-weight: bold;
  margin-right: 350px;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.search-input::placeholder {
  font-size: 14px;
  color: #cbcbcb;
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
.mb-3 {
  margin-bottom: 1rem;
}

.btn-select,
.btn-remove {
  background-color: #736efe;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-success {
  background-color: #736efe;
  border-color: #736efe;
  color: white;
  width: 120px; /* Ukuran tombol */
  height: 40px;
  font-size: 14px;
}

.btn-select:hover {
  background-color: #615dd7;
}

.btn-remove {
  background-color: #fe6e70;
}

.btn-remove:hover {
  background-color: #bb3232;
}

.search {
  flex: 1;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-label {
  font-weight: bold;
  color: #736efe;
  font-size: 20px;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
}

.form-price {
  font-weight: bold;
  color: #736efe;
  font-size: 20px;
}

.sort-icon {
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 10px;
}

.sort-icon:hover {
  color: #cbcbcb;
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
</style>