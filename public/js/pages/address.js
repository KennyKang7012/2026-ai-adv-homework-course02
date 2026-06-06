const { createApp, ref } = Vue;

createApp({
  setup() {
    if (!Auth.requireAuth()) return {};

    const currentUser = Auth.getUser();
    const userName = currentUser?.name || '';
    const userEmail = currentUser?.email || '';
    const userInitial = userName ? userName.charAt(0).toUpperCase() : '?';

    const showForm = ref(false);
    const addresses = ref([]);
    const newAddr = ref({ name: '', phone: '', address: '', isDefault: false });

    function addAddress() {
      if (!newAddr.value.name.trim() || !newAddr.value.address.trim()) {
        Notification.show('請填寫收件人姓名與地址', 'error');
        return;
      }
      addresses.value.push({ ...newAddr.value, isDefault: addresses.value.length === 0 });
      newAddr.value = { name: '', phone: '', address: '', isDefault: false };
      showForm.value = false;
      Notification.show('地址已新增', 'success');
    }

    function removeAddress(index) {
      addresses.value.splice(index, 1);
      Notification.show('地址已刪除', 'success');
    }

    return { userName, userEmail, userInitial, showForm, addresses, newAddr, addAddress, removeAddress };
  }
}).mount('#app');
