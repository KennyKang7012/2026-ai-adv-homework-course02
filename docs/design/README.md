# 設計稿與切版截圖索引

> 花漾生活電商網站 — 視覺設計文件

---

## 設計規範

| 項目 | 說明 |
|------|------|
| 主品牌色 | `#FF4FB6`（粉紅） |
| 深色背景 | `#1A1A1A` |
| 標題字型 | Playfair Display（義大利體） |
| UI 文字 | Funnel Sans |
| 內文 | Newsreader |
| 響應式斷點 | 768px（手機 / 桌面） |
| 設計工具 | Pencil MCP（design.pen） |

---

## 桌面版截圖（Desktop — 1440px）

| 檔案 | 頁面 | 路由 |
|------|------|------|
| `actual-01-homepage.png` | 首頁 | `/` |
| `actual-02-product-detail.png` | 商品詳情 | `/products/:id` |
| `actual-03-cart.png` | 購物車 | `/cart` |
| `actual-04-checkout.png` | 結帳 | `/checkout` |
| `actual-05-login.png` | 登入 | `/login` |
| `actual-06-orders.png` | 我的訂單 | `/orders` |
| `actual-07-404.png` | 404 頁面 | `*` |
| `actual-08-order-detail.png` | 訂單詳情（空載） | `/orders/:id` |
| `actual-08-order-detail-paid.png` | 訂單詳情（已付款） | `/orders/:id` |
| `actual-09-account.png` | 帳戶設定 | `/account` |
| `actual-10-address.png` | 收件地址管理 | `/address` |

---

## 手機版截圖（Mobile — 375px）

| 檔案 | 頁面 | 說明 |
|------|------|------|
| `mobile-01-homepage-responsive.png` | 首頁 | 漢堡 Nav ✅ |
| `mobile-02-product-detail.png` | 商品詳情 | 垂直堆疊版面 |
| `mobile-03-cart-v2.png` | 購物車 | 商品列 + 摘要堆疊 ✅ |
| `mobile-04-checkout-v2.png` | 結帳 | 表單 + 摘要堆疊 ✅ |

---

## 綠界金流頁面整合

切版已完整串接 ECPay AIO 金流，涵蓋以下頁面流程：

```
商品詳情（加入購物車）
  → 購物車（前往結帳）
  → 結帳（填寫收件資訊 + 送出）
  → 綠界付款頁（ChoosePayment: ALL，支援信用卡/WebATM/ATM 虛擬帳號等）
  → 土地銀行模擬頁（測試環境）
  → 訂單詳情（付款成功確認，顯示付款方式）
  → 我的訂單列表（訂單狀態更新）
```

---

## 響應式設計說明

| 區塊 | 桌面 | 手機（≤767px） |
|------|------|----------------|
| Nav | 完整導覽列 | 漢堡選單（☰），展開後顯示全部連結 |
| 商品詳情 | 左圖右文（雙欄） | 垂直堆疊 |
| 購物車 | 商品列＋摘要欄（雙欄） | 垂直堆疊 |
| 結帳 | 表單＋摘要（雙欄） | 垂直堆疊 |
| 訂單詳情 | 左主欄＋右側欄（雙欄） | 垂直堆疊 |
| 我的訂單 | 側欄＋主列表（雙欄） | 側欄橫向捲動 |
| 首頁商品格 | 4 欄 | 2 欄 |
| Padding | 80px | 20px |

---

## 設計原始檔

設計稿存放於專案根目錄 `design.pen`，使用 Pencil 桌面版開啟。
共包含 10 個頁面設計（01 Homepage → 10 Address Book）。
