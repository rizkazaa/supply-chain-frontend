import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [
      {
        product_id: "2024001",
        product_name: "Acer Nitro 15 AN515-58",
        category: "Intel Core i5 12500H, RTX 3050, RAM 8GB DDR4, LAYAR 15.6",
        quantity_of_product: 80,
      },
      {
        product_id: "2024002",
        product_name: "Lenovo LOQ 15 15IRH8",
        category: "Intel Core i5 13450H, RTX 3050, RAM 8GB DDR4, LAYAR 15.6",
        quantity_of_product: 80,
      },
    ],
  }),
  getters: {
    getProductById: (state) => (product_id) => {
      return state.products.find(
        (product) => product.product_id === product_id
      );
    },
    totalProducts: (state) => state.products.length,
  },
  actions: {
    addProduct(product) {
      this.products.push(product);
    },

    updateProduct(updatedProduct) {
      const index = this.products.findIndex(
        (product) => product.product_id === updatedProduct.product_id
      );

      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    },

    deleteProduct(product_id) {
      this.products = this.products.filter(
        (product) => product.product_id !== product_id
      );
    },
  },
  persist: true,
});
