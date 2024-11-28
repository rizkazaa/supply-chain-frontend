<template>
  <div class="product-card">
    <h3>{{ product.product_name }}</h3>
    <p>{{ product.category }}</p>
    <p class="stock">quantity_of_product: {{ product.quantity_of_product }}</p>
    <div class="buttons">
      <button @click="$emit('editProduct', product)" class="edit">Edit</button>
      <button
        @click="$emit('deleteProduct', product.product_id)"
        class="delete"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "productCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.product-card h3 {
  margin: 0 0 10px;
  font-size: 1.5em;
  color: #333;
}

.product-card p {
  margin: 5px 0;
  color: #555;
}

.product-card .stock {
  font-weight: bold;
  color: #2c3e50;
}

.product-card .buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.product-card button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.product-card button:hover {
  background-color: #ddd;
}

.product-card button.edit {
  background-color: #fed86e;
  color: white;
}

.product-card button.edit:hover {
  background-color: #bca052;
}

.product-card button.delete {
  background-color: #df3636;
  color: white;
}

.product-card button.delete:hover {
  background-color: #bb3232;
}
</style>
