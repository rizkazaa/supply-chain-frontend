import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: []
  }),
  actions: {
    async fetchProducts(){
      try {
        const response = await apiClient.get("/products");
        this.products = response.data;
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    },
    async fetchProductsByUserId(){
      try {
        const response = await apiClient.get("/products/user");
        this.products = response.data;
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    },

    async addProduct(product) {
      try {
        const response = await apiClient.post("/products", product);
      } catch (error) {
        console.error("Failed to add product:", error.message);
      }
    },

    async updateProduct(product) {
      try {
        const response = await apiClient.put(`/products/${product.product_id}`, product);
      } catch (error) {
        console.error("Failed to update product:", error);
      }
    },

    async deleteProduct(id) {
      try {
        await apiClient.delete(`/products/${id}`);

        this.products = this.products.filter((product) => product.id !== id);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    },
  },
  persist: true,
});
