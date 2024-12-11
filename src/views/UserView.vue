<template>
  <div id="user-view">
    <div>
      <div class="scrollable-content">
        <Dashboard v-if="currentComponent === 'dashboard'" />
        <ItemList
          v-if="currentComponent === 'products'"
          @edit-item="showEditForm"
        />
        <UserList v-if="currentComponent === 'users'" />
        <TransactionList v-if="currentComponent === 'transactions'" />
        <HistoryList v-if="currentComponent === 'history'" />
        <Profile v-if="currentComponent === 'profile'" />
        <Label v-if="currentComponent === 'label'" />
      </div>
    </div>
    <div v-if="showForm" class="form-container">
      <TransactionForm
        :product="selectedproduct"
        :isEdit="isEdit"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script>
import ItemList from "@/components/user/item/ItemList.vue";
import ItemForm from "@/components/user/item/ItemForm.vue";
import UserList from "@/components/admin/user/UserList.vue";
import TransactionForm from "@/components/user/transaction/TransactionForm";
import Profile from "@/components/user/profile/Profile.vue";
import HistoryList from "@/components/user/history/HistoryList.vue";
import TransactionList from "@/components/user/transaction/TransactionList.vue";
import Dashboard from "@/components/user/dashboard/dashboard.vue";

export default {
  components: {
    Dashboard,
    ItemList,
    ItemForm,
    UserList,
    TransactionForm,
    TransactionList,
    HistoryList,
    Profile,
  },

  props: {
    currentComponent: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      showForm: false,
      selectedproduct: null,
      isEdit: false,
    };
  },

  methods: {
    showEditForm(product) {
      this.selectedproduct = product;
      this.isEdit = true;
      this.showForm = true;
    },
    showAddForm() {
      this.selectedproduct = null;
      this.isEdit = false;
      this.showForm = true;
    },
    handleSubmit(formData) {
      this.showForm = false;
      this.selectedproduct = null;
      this.isEdit = false;
    },
    canceledEditForm() {
      this.showForm = false;
      this.selectedproduct = null;
      this.isEdit = false;
    },
  },
};
</script>

<style scoped>
.user-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: calc(100vh - 60px);
}

.form-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
