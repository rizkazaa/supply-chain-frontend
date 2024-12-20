<template>
  <div :class="['label-container', { compact: isCompact }]">
    <!-- Container untuk order-info dan logo -->
    <div class="header-container">
      <div class="label-info">
        <p><strong>Order No :</strong> {{ label.product_id }}</p>
        <p><strong>Supplier ID :</strong> {{ label.user_id }}</p>
      </div>
      <div class="logo">
        <img
          src="@/assets/logoRumin.png"
          alt="Rumin Autoparts Logo"
          class="logoUrl"
        />
      </div>
    </div>

    <div class="barcode-section">
      <pre>
        {{ qrCode }}
      </pre>
    </div>

    <table class="product-table">
      <thead>
        <tr>
          <th>NO</th>
          <th>PRODUCT</th>
          <th>QUANTITY</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>{{ label.Master_Data?.product_name }}</td>
          <td>{{ label.Order?.quantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: Object,
      required: true,
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    qrCode() {
      return this.label.qr_code.replace();
    },
  },
};
</script>

<style scoped>
.label-container {
  width: 500px;
  padding: 20px;
  border: 1px solid black;
  margin-bottom: 20px;
}

.label-container.compact {
  width: 100%;
  padding: 16px;
}

.header-container {
  display: flex;
  border: 1px solid black;
  margin-bottom: 20px;
  margin-top: 20px;
}

.label-info {
  font-size: 14px;
  flex: 1;
  border-right: 1px solid black;
  padding: 10px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 10px;
}

.logoUrl {
  max-width: 150px;
  height: auto;
}

.barcode-section {
  text-align: center;
  margin: 0;
  scale: 0.8;
}

/* .barcode-section img {
  width: 200px;
  height: 100px;
} */

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 20px;
}

.product-table th,
.product-table td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
}
</style>
