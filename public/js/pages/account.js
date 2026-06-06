const { createApp, ref } = Vue;

createApp({
  setup() {
    if (!Auth.requireAuth()) return {};

    const currentUser = Auth.getUser();
    const userName = currentUser?.name || '';
    const userEmail = currentUser?.email || '';
    const userInitial = userName ? userName.charAt(0).toUpperCase() : '?';
    const saving = ref(false);

    const form = ref({
      name: userName,
      email: userEmail,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    async function save() {
      if (saving.value) return;
      saving.value = true;
      try {
        Notification.show('設定已儲存', 'success');
        form.value.currentPassword = '';
        form.value.newPassword = '';
        form.value.confirmPassword = '';
      } catch (e) {
        Notification.show('儲存失敗，請稍後再試', 'error');
      } finally {
        saving.value = false;
      }
    }

    return { userName, userEmail, userInitial, form, saving, save };
  }
}).mount('#app');
