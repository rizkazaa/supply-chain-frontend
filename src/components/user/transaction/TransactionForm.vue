<template>
  <div>
    <h3>Reorder</h3>
    <form @submit.prevent="submitOrder" class="p-3">
      <div class="mb-3">
        <label for="productSelect" class="form-label">Select Product</label>

        <select
          v-model="form.product_id"
          id="productSelect"
          class="form-control"
          required
        >
          <option value="" disabled>Select Product...</option>
          <option
            v-for="product in products"
            :key="product.product_id"
            :value="product.product_id"
          >
            {{ product.product_name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="quantity" class="form-label">Quantity</label>

        <input
          type="number"
          v-model.number="form.quantity"
          id="quantity"
          class="form-control"
          min="1"
          required
        />
      </div>

      <div class="mb-3">
        <label for="totalPrice" class="form-label">Total Price</label>
        <input
          type="text"
          id="totalPrice"
          class="form-control"
          :value="formPrice"
          disabled
        />
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-success">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      default: () => [],
    },
    order: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        order_id: 0,
        product_id: null,
        quantity: 1,
      },
    };
  },
  computed: {
    formPrice() {
      const selectedProduct = this.products.find(
        (product) => product.product_id === this.form.product_id
      );
      const totalPrice = selectedProduct
        ? (selectedProduct.price || 0) * (this.form.quantity || 0)
        : 0;
      // Format harga dalam format Rupiah
      return totalPrice.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      });
    },
  },
  methods: {
    submitOrder() {
      if (!this.form.product_id || !this.form.quantity) {
        alert("Mohon lengkapi data produk dan quantity!");
        return;
      }
      this.form.order_id = this.order.order_id
      this.$emit("submit-form", {
        ...this.form,
        total_price: this.formPrice,
      });
    },
  },
  emits: ["submit-form"],
};
</script>

<style scoped>
form {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
}

.mb-3 {
  margin-bottom: 1rem;
}

.form-control {
  border-radius: 4px;
  border: 1px solid #cbcbcb;
  color: #4b3f6b;
  font-size: 14px;
}

.form-control:focus {
  border-color: #4b3f6b;
  box-shadow: 0 0 0 0.2rem rgba(75, 63, 107, 0.25);
}

.form-label {
  font-weight: bold;
  color: #736efe;
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
  width: 120px; /* Ukuran tombol */
  height: 40px;
  font-size: 14px;
  gap: 10px;
  margin: 20px 20px;
}

.btn-success:hover {
  background-color: #615dd7;
  border-color: #615dd7;
}

.btn-secondary {
  background-color: #fe6e70;
  border-color: #fe6e70;
  color: white;
  width: 120px; /* Ukuran tombol */
  height: 40px;
  font-size: 14px;
}

.btn-secondary:hover {
  background-color: #bb3232;
  border-color: #bb3232;
}

h3 {
  color: #736efe;
  font-weight: bold;
  margin: 20px;
  font-size: 24px;
}
</style>
