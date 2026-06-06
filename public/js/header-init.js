document.addEventListener('DOMContentLoaded', function () {
  const authNav = document.getElementById('auth-nav');
  const cartBadge = document.getElementById('cart-badge');
  const ordersLink = document.getElementById('orders-link');

  const navLinkStyle = 'font-size:11px; color:rgba(255,255,255,.65); letter-spacing:0.18em; text-transform:uppercase; text-decoration:none;';
  if (authNav) {
    if (Auth.isLoggedIn()) {
      const user = Auth.getUser();
      let html = '';
      if (Auth.isAdmin()) {
        html += '<a href="/admin/products" class="font-ui" style="' + navLinkStyle + ' color:#FF4FB6;">後台管理</a>';
      }
      html += '<span class="font-ui" style="' + navLinkStyle + ' color:#FF4FB6;">' + (user?.name || '') + ' ▾</span>';
      html += '<button onclick="Auth.logout()" class="font-ui" style="' + navLinkStyle + ' background:none; border:none; cursor:pointer;" onmouseover="this.style.color=\'#FF4FB6\'" onmouseout="this.style.color=\'rgba(255,255,255,.65)\'">登出</button>';
      authNav.innerHTML = html;
    } else {
      authNav.innerHTML = '<a href="/login" class="font-ui" style="' + navLinkStyle + '" onmouseover="this.style.color=\'#FF4FB6\'" onmouseout="this.style.color=\'rgba(255,255,255,.65)\'">登入</a>';
    }
  }

  if (ordersLink) {
    ordersLink.style.display = Auth.isLoggedIn() ? '' : 'none';
  }

  if (cartBadge) {
    apiFetch('/api/cart').then(function (res) {
      if (res && res.data && res.data.items && res.data.items.length > 0) {
        cartBadge.textContent = res.data.items.length;
        cartBadge.style.display = 'flex';
      }
    }).catch(function () {});
  }
});
