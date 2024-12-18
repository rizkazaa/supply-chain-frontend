import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";

export const useOrderStore = defineStore("orderStore", {
  state: () => ({
    orders: [], // Menyimpan daftar orders
  }),
  actions: {
    // Fetch daftar semua orders
    async fetchOrders() {
      try {
        const response = await apiClient.get("/orders");
        this.orders = response.data;
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error.response?.data || error.message
        );
      }
    },

    // Fetch orders berdasarkan ID user (misalnya, jika orders terkait dengan user tertentu)
    async fetchOrdersByUserId() {
      try {
        const response = await apiClient.get(`/orders/user`);
        this.orders = response.data;
      } catch (error) {
        console.error(
          "Failed to fetch orders by user ID:",
          error.response?.data || error.message
        );
      }
    },

    // Menambah order baru
    async addOrder(order) {
      try {
        const response = await apiClient.post("/orders/order", order);
        // Optional: Menambahkan order yang baru ke dalam store setelah ditambahkan
        this.orders.push(response.data);
      } catch (error) {
        console.error(
          "Failed to add order:",
          error.response?.data || error.message
        );
      }
    },

    // Mengupdate order
    async updateOrder(order) {
      try {
        const response = await apiClient.patch(
          `/orders/verify/${order.order_id}`,
          order
        );
        // Optional: Update state orders setelah update berhasil
        const index = this.orders.findIndex(
          (o) => o.order_id === order.order_id
        );
        if (index !== -1) {
          this.orders[index] = response.data;
        }
      } catch (error) {
        console.error(
          "Failed to update order:",
          error.response?.data || error.message
        );
      }
    },

    // Menghapus order
    async rejectOrder(order) {
      console.log(order);
      try {
        const response = await apiClient.post(
          `/orders/reject/${order.order_id}`,
          order
        );
        // Optional: Update state orders setelah update berhasil
        const index = this.orders.findIndex(
          (o) => o.order_id === order.order_id
        );
        if (index !== -1) {
          this.orders[index] = response.data;
        }
      } catch (error) {
        console.error(
          "Failed to delete order:",
          error.response?.data || error.message
        );
      }
    },

    // Menghapus order
    async switchOrder(order) {
      console.log(order);
      try {
        const response = await apiClient.patch(
          `/orders/updateorder/${order.order_id}`,
          order
        );
        // Optional: Update state orders setelah update berhasil
        const index = this.orders.findIndex(
          (o) => o.order_id === order.order_id
        );
        if (index !== -1) {
          this.orders[index] = response.data;
        }
      } catch (error) {
        console.error(
          "Failed to delete order:",
          error.response?.data || error.message
        );
      }
    },
  },
  persist: true, // Menyimpan state agar tetap ada saat aplikasi di-reload
});
