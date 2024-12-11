<template>
  <div class="order-form">
    <h2>Order Product</h2>
    <form @submit.prevent="submitOrder">
      <div>
        <label for="product">Select Product:</label>
        <select id="product" v-model="selectedProduct" @change="updateTotal">
          <option
            v-for="product in products"
            :key="product.product_id"
            :value="product"
          >
            {{ product.product_name }} (Price: {{ product.price }})
          </option>
        </select>
      </div>

      <div>
        <label for="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          v-model.number="quantity"
          @input="updateTotal"
          min="1"
        />
      </div>

      <div>
        <label>Total Price:</label>
        <p>{{ totalPrice }}</p>
      </div>

      <button type="submit">Place Order</button>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useOrderStore } from "@/store/orderStore";
import { useProductStore } from "@/store/itemStore";

export default {
  setup() {
    const orderStore = useOrderStore();
    const productStore = useProductStore();
    const products = ref([]);
    const selectedProduct = ref(null);
    const quantity = ref(1);
    const totalPrice = computed(() =>
      selectedProduct.value ? selectedProduct.value.price * quantity.value : 0
    );

    const fetchProducts = async () => {
      await productStore.fetchProductsByUserId();
      products.value = productStore.products;
    };

    const submitOrder = async () => {
      if (!selectedProduct.value || quantity.value < 1) {
        alert("Please select a product and enter a valid quantity.");
        return;
      }
      await orderStore.createOrder({
        product_id: selectedProduct.value.product_id,
        quantity: quantity.value,
        total: totalPrice.value,
        category: selectedProduct.value.category,
      });
      alert("Order placed successfully!");
    };

    onMounted(fetchProducts);

    return {
      products,
      selectedProduct,
      quantity,
      totalPrice,
      submitOrder,
    };
  },
};
</script>
