<template>
  <form @submit.prevent="submitOrder" class="p-3">
    <h3 class="form-title mb-3">Order</h3>
    <div class="row mb-3 align-items-center">
      <div class="col-md-4">
        <label for="productSelect" class="form-label label-style">Select Product:</label>
      </div>
      <div class="col-md-8">
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
    </div>
    <div class="row mb-3 align-items-center">
      <div class="col-md-4">
        <label for="quantity" class="form-label label-style">Quantity</label>
      </div>
      <div class="col-md-8">
        <input
          type="number"
          v-model.number="form.quantity"
          id="quantity"
          class="form-control"
          min="1"
          required
        />
      </div>
    </div>
    <p class="form-price mb-3 label-style">
      Total Price: {{ formPrice }}
    </p>
    <div class="text-center">
      <button type="submit" class="btn btn-success">Buy</button>
    </div>
  </form>
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
.form-price {
  font-weight: bold;
  color: #736efe;
  font-size: 16px;
}

.label-style {
  color: #736efe;
  font-weight: 600;
  font-size: 16px;
}

.form-title {
  color: #736efe;
  font-weight: 600;
  font-size: 24px;
}
</style>
