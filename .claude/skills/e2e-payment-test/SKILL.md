---
name: e2e-payment-test
description: 執行花漾生活電商網站（http://localhost:3001）的完整金流 E2E 自動化測試。當使用者說「跑 E2E 測試」、「測試金流」、「執行自動化測試」、「驗證付款流程」、「run e2e」時，立即觸發此 Skill。使用 Playwright MCP 完成從登入、加入購物車、結帳、ECPay 模擬付款到訂單確認的完整流程，並驗證異常情境。
---

# E2E 金流自動化測試

使用 Playwright MCP 對花漾生活（http://localhost:3001）執行完整的端對端付款流程測試，確保每次修改後系統行為符合預期。

## 前置確認

執行前先確認：
1. 伺服器已在 `http://localhost:3001` 啟動（可用 `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001` 確認）
2. 若伺服器未啟動，提示使用者執行 `npm run start`

## 測試帳號

- Email：`admin@hexschool.com`
- 密碼：`12345678`

## 測試資料（收件資訊）

- 收件人姓名：`kenn123`
- Email：`kenny123@123.com`
- 收件地址：`taiwan`

---

## 正常流程測試（Happy Path）

依序執行以下每個步驟，每步驟完成後用 `browser_snapshot` 或 `browser_take_screenshot` 確認結果，記錄通過 ✅ 或失敗 ❌。

### Step 1：登入

1. `browser_navigate` → `http://localhost:3001/login`
2. 等待頁面載入，確認出現「電子郵件」與「密碼」欄位
3. `browser_fill_form`：填入 Email 與密碼
4. `browser_click`：點選「登入」按鈕（form 內的登入 button）
5. ✅ 預期：URL 跳轉至 `http://localhost:3001/`，頁面標題包含「首頁」

### Step 2：加入購物車

1. `browser_navigate` → `http://localhost:3001`
2. `browser_snapshot`：找到任一商品的「加入」或「加入購物車」按鈕
3. `browser_click`：點選第一個可見的商品卡片，進入商品詳情頁
   - 若無法直接點卡片，改從首頁商品列表找到商品連結
4. 在商品詳情頁：`browser_click` 點選「加入購物車」按鈕
5. ✅ 預期：Nav 上的購物車數字 badge 出現（數字 ≥ 1）

### Step 3：進入結帳

1. `browser_navigate` → `http://localhost:3001/cart`
2. `browser_snapshot`：確認購物車有商品（非空車狀態）
3. `browser_click`：點選「前往結帳」按鈕
4. ✅ 預期：URL 跳轉至 `http://localhost:3001/checkout`

### Step 4：填寫收件資訊並送出

1. `browser_snapshot`：確認頁面有「收件人姓名」、「電子郵件」、「收件地址」三個輸入框
2. `browser_fill_form`：依序填入測試資料（kenn123 / kenny123@123.com / taiwan）
3. `browser_click`：點選「確認送出訂單」按鈕
4. ✅ 預期：URL 跳轉至 `https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5`

### Step 5：綠界模擬付款（網路 ATM / 台灣土地銀行）

1. `browser_snapshot`：確認付款方式列表出現
2. `browser_click`：點選「WebATM（網路ATM）」
3. `browser_snapshot`：確認銀行選擇下拉出現
4. `browser_select_option`：選擇「台灣土地銀行」
5. `browser_click`：點選「前往付款」連結
6. `browser_snapshot`：確認出現提示 modal（含「關閉」按鈕）
7. `browser_click`：點選「關閉」按鈕
8. ✅ 預期：URL 跳轉至 `https://pay-stage.ecpay.com.tw/MockMPPost/LandWebAtm`

### Step 6：土地銀行模擬頁完成交易

1. `browser_snapshot`：確認頁面有 RC=0、MSG=交易成功、CurAmt=付款金額
2. `browser_click`：點選「Save」按鈕（使用 `page.getByRole('button', { name: 'Save' })` 或 snapshot ref）
3. ✅ 預期：URL 跳轉至 `https://payment-stage.ecpay.com.tw/bank/PaymentCenter/cntnotlogin/webatm/result`，頁面標題「付款成功|綠界科技」

### Step 7：返回商店確認訂單

1. `browser_click`：點選「返回商店」連結
2. `browser_snapshot`：確認頁面內容
3. ✅ 預期：
   - 頁面顯示「付款成功！感謝您的購買。」
   - 訂單狀態 badge 顯示「已付款」
   - 收件資訊正確（kenn123 / kenny123@123.com / taiwan）

### Step 8：訂單列表確認

1. `browser_navigate` → `http://localhost:3001/orders`
2. `browser_snapshot`：讀取訂單列表
3. ✅ 預期：
   - 最新訂單出現在列表第一筆
   - 狀態顯示「已付款」
   - 金額與商品正確

---

## 異常情境測試（Edge Cases）

### E1：空購物車直接結帳

1. 先確認購物車為空（或清空購物車）
2. `browser_navigate` → `http://localhost:3001/checkout`
3. ✅ 預期：自動跳轉至 `/cart`，不進入結帳頁

### E2：未登入存取訂單頁

1. 先登出（或使用無痕視窗）
2. `browser_navigate` → `http://localhost:3001/orders`
3. ✅ 預期：跳轉至 `/login?redirect=%2Forders`

### E3：結帳欄位驗證

1. 進入 `/checkout`（購物車有商品且已登入）
2. 不填任何欄位，直接點選「確認送出訂單」
3. `browser_snapshot`：確認錯誤訊息出現
4. ✅ 預期：姓名、Email、地址各自顯示對應的錯誤提示文字（不跳轉付款頁）

---

## 測試結果彙整

每個步驟執行完畢後，輸出以下格式的測試報告：

```
## E2E 金流測試報告 — [執行時間]

### 正常流程
| 步驟 | 說明 | 結果 |
|------|------|------|
| Step 1 | 登入 | ✅ / ❌ |
| Step 2 | 加入購物車 | ✅ / ❌ |
| Step 3 | 進入結帳 | ✅ / ❌ |
| Step 4 | 填寫資訊送出 | ✅ / ❌ |
| Step 5 | 綠界付款選擇 | ✅ / ❌ |
| Step 6 | 模擬交易完成 | ✅ / ❌ |
| Step 7 | 返回商店確認 | ✅ / ❌ |
| Step 8 | 訂單列表驗證 | ✅ / ❌ |

### 異常情境
| 案例 | 說明 | 結果 |
|------|------|------|
| E1 | 空購物車直接結帳 | ✅ / ❌ |
| E2 | 未登入存取訂單頁 | ✅ / ❌ |
| E3 | 結帳欄位驗證 | ✅ / ❌ |

### 訂單資訊
- 訂單編號：[從頁面讀取]
- 付款方式：網路 ATM（台灣土地銀行）
- 金額：[從頁面讀取]
- 狀態：已付款

### 總結
- 通過：X / 11 項
- 失敗：[列出失敗步驟與原因]
```

若有步驟失敗，擷取截圖（`browser_take_screenshot`）並說明失敗原因，協助使用者定位問題。
