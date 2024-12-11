<template>
  <div>
    <h3>{{ isEdit ? "Edit Product" : "Add Product" }}</h3>
    <form @submit.prevent="submitForm" class="mb-3">
      <div class="mb-3">
        <label for="product_name" class="form-label">Product</label>

        <input
          type="text"
          v-model="form.product_name"
          id="product_name"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">price</label>

        <input
          type="number"
          v-model="form.price"
          id="quantity"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="quantity" class="form-label">Quantity</label>

        <input
          type="number"
          v-model="form.quantity"
          :placeholder="form?.Quantity?.[0]?.quantity_of_product ?? 0"
          id="quantity"
          class="form-control"
          required
        />
      </div>
      <div class="button-container">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          Cancel
        </button>
        <button type="submit" class="btn btn-success">
          {{ isEdit ? "Save" : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        product_name: "",
        price: 0,
        quantity: 0,
      },
    };
  },
  watch: {
    product: {
      immediate: true,
      handler(newProduct) {
        if (this.isEdit) {
          this.form = { ...newProduct };
        } else {
          this.form = {
            product_name: "",
            price: 0,
            quantity: 0,
          };
        }
      },
    },
  },
  methods: {
    submitForm() {
      if (
        this.form.product_name &&
        this.form.price &&
        this.form.quantity !== null &&
        this.form.quantity !== undefined
      ) {
        this.$emit("submit", this.form);
      }
    },
  },
  emits: ["submit"],
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
