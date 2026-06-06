const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const productId = document.getElementById('app').dataset.productId;
    const product = ref(null);
    const loading = ref(true);
    const notFound = ref(false);
    const quantity = ref(1);
    const adding = ref(false);
    const activeImage = ref(null);
    const relatedProducts = ref([]);

    const thumbImages = computed(function () {
      if (!product.value || !product.value.image_url) return [];
      return [product.value.image_url, product.value.image_url, product.value.image_url, product.value.image_url];
    });

    function decrease() {
      if (quantity.value > 1) quantity.value--;
    }

    function increase() {
      if (product.value && quantity.value < product.value.stock) quantity.value++;
    }

    async function addToCart() {
      if (!product.value || adding.value) return;
      adding.value = true;
      try {
        await apiFetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: product.value.id, quantity: quantity.value })
        });
        Notification.show('已加入購物車', 'success');
        var badge = document.getElementById('cart-badge');
        if (badge) {
          var count = parseInt(badge.textContent || '0') + 1;
          badge.textContent = count;
          badge.style.display = 'flex';
        }
      } catch (e) {
        Notification.show('加入購物車失敗', 'error');
      } finally {
        adding.value = false;
      }
    }

    onMounted(async function () {
      try {
        const res = await apiFetch('/api/products/' + productId);
        product.value = res.data;
        activeImage.value = res.data.image_url;
      } catch (e) {
        notFound.value = true;
        loading.value = false;
        return;
      }
      loading.value = false;
      try {
        const rel = await apiFetch('/api/products/' + productId + '/related');
        relatedProducts.value = rel.data || [];
      } catch (e) {}
    });

    return { product, loading, notFound, quantity, adding, activeImage, thumbImages, relatedProducts, decrease, increase, addToCart };
  }
}).mount('#app');
