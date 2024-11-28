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
          />
        </div>
        <button class="add-btn" @click="showAddForm">
          <i class="fa-solid fa-plus icon"></i>Add Product
        </button>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th class="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.product_id">
              <td>{{ product.product_id }}</td>
              <td>{{ product.product_name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.quantity_of_product }}</td>
              <td class="action-buttons">
                <button class="edit-btn" @click="editProduct(product)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="delete-btn"
                  @click="deleteProduct(product.product_id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <nav aria-label="page-navigation-table">
          <ul class="pagination">
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
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-product"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
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
import Modal from "@/components/Modal.vue";
import ItemForm from "@/components/admin/item/ItemForm.vue";
import { useProductStore } from "@/store/itemStore";
import { EventBus } from "@/utils/EventBus";

export default {
  components: {
    Modal,
    ItemForm,
  },

  data() {
    return {
      showForm: false,
      selectedproduct: null,
      isEdit: false,
      currentPage: 1,
      productsPerPage: 5,
      searchQuery: "",
    };
  },

  computed: {
    // Menggunakan computed property untuk mengambil produk dari store
    products() {
      return this.itemStore.products; // Ambil dari store
    },

    filteredProducts() {
      return this.products.filter((product) => {
        return (
          (product.product_id &&
            String(product.product_id)
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())) || // Pastikan product_id menjadi string
          (product.product_name &&
            product.product_name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()))
        );
      });
    },

    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage); // Gunakan filteredProducts
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = start + this.productsPerPage;
      return this.filteredProducts.slice(start, end); // Gunakan filteredProducts
    },
  },

  methods: {
    showAddForm() {
      this.selectedproduct = {
        product_id: "",
        product_name: "",
        category: "",
        quantity_of_product: 0,
      };
      this.isEdit = false;
      this.showForm = true;
    },

    editProduct(product) {
      this.selectedproduct = { ...product };
      this.isEdit = true;
      this.showForm = true;
    },

    handleSubmit(product) {
      if (
        product.product_id &&
        product.product_name &&
        product.category &&
        product.quantity_of_product !== null &&
        !isNaN(product.quantity_of_product)
      ) {
        if (this.isEdit) {
          this.itemStore.updateProduct(product); // Memanggil action 'updateproduct' dari store
        } else {
          this.itemStore.addProduct(product); // Memanggil action 'addproduct' dari store
        }

        this.showForm = false;
      }
    },

    cancelEditForm() {
      this.showForm = false;
    },

    deleteProduct(product_id) {
      this.itemStore.deleteProduct(product_id); // Memanggil action 'deleteproduct' dari store
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

  mounted() {
    EventBus.on("search", this.handleSearch);
  },

  beforeUnmount() {
    EventBus.off("search", this.handleSearch);
  },

  setup() {
    const itemStore = useProductStore();
    return { itemStore };
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
  align-products: center;
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
  align-products: center;
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
  align-products: center;
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
    align-products: stretch;
  }

  .action-buttons button {
    margin: 5px 0;
  }
}
</style>
