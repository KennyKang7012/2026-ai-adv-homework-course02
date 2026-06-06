# 專案開發歷程知識庫

> 記錄從初始提示詞到最終完成的完整開發過程，供後續維護與回顧參考。

---

## 一、起點：初始提示詞

```
請重新設計本網站的所有前台頁面，
並搭配 Pencil MCP 繪製在 @design.pen 畫面上，
同時必須搭配 /frontend-design 的 skill
```

**目標**：以 `/frontend-design` Skill 為設計基準，透過 Pencil MCP 建立完整設計稿，再將設計稿全面實作至 EJS 前台頁面。

---

## 二、技術架構總覽

| 層級 | 技術 |
|------|------|
| 後端框架 | Node.js + Express |
| 資料庫 | SQLite（better-sqlite3，WAL 模式） |
| 前台樣板 | EJS + Tailwind CSS |
| 前台互動 | Vue 3（CDN，無建置工具） |
| 設計工具 | Pencil MCP（.pen 檔） |
| 金流串接 | 綠界科技 ECPay AIO（測試環境） |
| E2E 測試 | Playwright MCP |
| 單元測試 | Vitest + supertest |

---

## 三、開發歷程

### 階段 1：專案初始化
**Commit** `4378517` 初始化專案

建立 Node.js + Express 全端架構，包含：
- SQLite 資料庫（users、products、cart_items、orders、order_items）
- RESTful API（認證、商品、購物車、訂單、後台管理）
- 綠界 ECPay 金流工具模組（`src/utils/ecpay.js`）
- Vitest 單元測試框架

---

### 階段 2：設計稿建立（Pencil MCP + /frontend-design Skill）
**Commit** `796805c` 新增前台所有頁面的 UI 設計稿

使用 `/frontend-design` Skill 驅動 Pencil MCP，在 `design.pen` 中繪製 8 個前台頁面：

| 頁面 ID | 頁面名稱 | 尺寸 |
|---------|----------|------|
| 01 Homepage | 首頁 | 1440 × 4200 |
| 02 Product Detail | 商品詳情 | 1440 × 1400 |
| 03 Cart | 購物車 | 1440 × 1100 |
| 04 Checkout | 結帳 | 1440 × 1050 |
| 05 Login | 登入 | 1440 × 900 |
| 06 Orders | 我的訂單 | 1440 × 960 |
| 07 404 | 找不到頁面 | 1440 × 900 |
| 08 Order Detail | 訂單詳情 | 1440 × 1080 |

**設計語言**：
- 品牌色：`#FF4FB6`（粉色）、`#1A1A1A`（深黑）
- 字型：Playfair Display（標題）、Funnel Sans（UI 文字）、Newsreader（內文）
- 圖片：Unsplash 真實花卉攝影（對應 photo ID 已記錄在設計稿）

---

### 階段 3：設計稿全面實作
**Commit** `56c96ca` 將設計稿全面實作至所有前台 EJS 頁面

依設計稿逐一實作 EJS 頁面，包含：
- 首頁（Hero、精選推薦、品牌故事、服務區、全商品、顧客評價、Footer）
- 商品詳情（麵包屑、主圖、規格、數量選擇、加入購物車）
- 購物車（雙欄佈局、商品列表、訂單摘要）
- 結帳（3 步驟流程、收件表單、訂單摘要）
- 登入（全螢幕背景、卡片居中、登入/註冊 Tab）
- 我的訂單（側欄導覽、訂單列表）
- 404（全螢幕深色背景、數字字體）
- 訂單詳情（商品明細表、訂單資訊卡、收件資訊卡）

---

### 階段 4：第一輪細節修正
**Commit** `cdd131f` 修正 CSS focus 輪廓
**Commit** `181421d` 對齊設計稿與實際頁面的三處差異
**Commit** `cd58a73` 修正登入頁面：卡片置中、背景圖正確
**Commit** `12259cf` 全面對齊 EJS 實作與設計稿圖片及 Overlay 參數
**Commit** `3f5ca8a` 修正「關於我們」連結指向首頁品牌故事錨點（`/#story`）

**重要決策**：「關於我們」無獨立頁面，設計稿本意為錨點連結 `/#story`，確認正確後不再視為缺口。

---

### 階段 5：設計稿缺口全面比對分析
**Commit** `565c978` 新增設計稿缺口報告（`docs/DESIGN_GAP.md`）

使用 **Playwright MCP** 巡覽 `http://localhost:3001` 每個頁面，搭配 **Pencil MCP** 逐節讀取 `design.pen` 設計稿，進行完整對照。

**檢視方式**：
1. `mcp__pencil__batch_get` 讀取設計稿節點與參數
2. `mcp__playwright__browser_navigate` + `browser_snapshot` 截取實際頁面
3. 逐欄比對，記錄 ✅ / ❌ / ⚠️

**初次發現缺口（共 20+ 項）**，主要集中於：
- 商品詳情：縮圖列未實作、相關商品區塊未實作
- 購物車/結帳：折扣行未顯示
- 結帳：表單寬度偏窄（max-width 限制）、聯絡電話/備註欄位
- 登入/404/結帳：仍有標準 Nav（設計稿無）
- 我的訂單：側欄用戶資訊不完整、商品摘要文字缺失
- 訂單詳情：商品小計行缺失、付款方式欄位缺失

---

### 階段 6：E2E 金流測試 Skill 建立
**Commit** `bde533e` 新增 `.claude/skills/e2e-payment-test/SKILL.md`

**觸發關鍵字**：「跑 E2E 測試」、「測試金流」、「執行自動化測試」

**涵蓋 12 個測試案例**：

**正常流程（8 步）**：
1. 登入（admin@hexschool.com / 12345678）
2. 加入購物車（粉色玫瑰花束）
3. 前往結帳
4. 填寫收件資訊送出（kenn123 / kenny123@123.com / taiwan）
5. 選擇網路 ATM / 台灣土地銀行
6. 模擬頁 Save 完成交易
7. 返回商店確認付款成功
8. 訂單列表驗證

**異常情境（4 項）**：
- E1：空購物車訪問 `/checkout` → 跳轉 `/cart`
- E2：未登入訪問 `/orders` → 跳轉 `/login?redirect=%2Forders`
- E3：空白送出結帳表單 → 三欄各顯示錯誤訊息
- E4：404 頁面 → 無標準 Nav、PAGE NOT FOUND 內容正確、「回到首頁」可用

---

### 階段 7：批量實作設計稿缺口（第一批）
**Commit** `3fa246e` 實作設計稿缺口：補齊多頁面功能與 DB 欄位

**修正項目**：

| 檔案 | 修改內容 |
|------|----------|
| `public/js/header-init.js` | Nav 登入後顯示用戶名稱加粉色 ▾ |
| `views/pages/orders.ejs` | 側欄加用戶頭像（首字母圓形）、姓名、Email、帳戶設定、收件地址連結 |
| `public/js/pages/orders.js` | 從 `Auth.getUser()` 讀取 userName / userEmail / userInitial |
| `views/pages/orders.ejs` | 訂單列加商品摘要文字（`items_summary`） |
| `views/pages/order-detail.ejs` | 新增商品小計行（與總計分離顯示） |
| `views/pages/order-detail.ejs` | 訂單資訊卡加入付款方式欄位 |
| `views/pages/cart.ejs` | 加入折扣行（-NT$ 0） |
| `views/pages/checkout.ejs` | 移除 max-width:600px 限制，加入折扣行 |
| `src/database.js` | 新增 `payment_method` 欄位 migration |
| `src/routes/orderRoutes.js` | GET /api/orders 回傳 `items_summary`；check-payment 儲存付款方式 |
| `src/routes/orderRoutes.js` | 新增 `resolvePaymentMethod()` 函式（WebATM→網路 ATM 等） |

**新增設計稿頁面（Pencil MCP）**：
- `09 Account Settings`（帳戶設定）
- `10 Address Book`（收件地址）

---

### 階段 8：批量實作設計稿缺口（第二批）
**Commit** `9322725` 完成剩餘 5 項設計稿缺口實作

**修正項目**：

| 檔案 | 修改內容 |
|------|----------|
| `views/layouts/front.ejs` | 加入 `noHeader` / `noFooter` 旗標支援 |
| `src/routes/pageRoutes.js` | login、checkout 傳入 `noHeader: true, noFooter: true` |
| `app.js` | 404 頁面傳入 `noHeader: true, noFooter: true` |
| `views/pages/checkout.ejs` | 改為結帳專用 Nav（品牌 + 步驟列，無標準導覽） |
| `views/pages/product-detail.ejs` | 加入 4 張縮圖列（可點擊切換主圖） |
| `views/pages/product-detail.ejs` | 加入「您可能也會喜歡」相關商品區塊（3 張卡片） |
| `public/js/pages/product-detail.js` | 加入 activeImage / thumbImages / relatedProducts 狀態，修正錯誤處理（分離 notFound 與 related 錯誤） |
| `src/routes/productRoutes.js` | 新增 `GET /api/products/:id/related`（隨機 3 筆） |
| `views/pages/account.ejs` | 帳戶設定頁（基本資訊 + 修改密碼） |
| `public/js/pages/account.js` | 帳戶設定 Vue 腳本 |
| `views/pages/address.ejs` | 收件地址管理頁（新增/刪除/預設標記） |
| `public/js/pages/address.js` | 收件地址 Vue 腳本 |
| `src/routes/pageRoutes.js` | 新增 `/account`、`/address` 路由 |

---

### 階段 9：響應式設計實作
**Commit** `4af97a6` 新增設計截圖目錄並實作響應式設計

**修正項目**：
- `public/css/input.css`：新增 Mobile（≤767px）與 Tablet（768-1023px）媒體查詢，語義 class（`.page-two-col` / `.page-main-col` / `.page-side-col`）
- `views/partials/header.ejs`：加入漢堡選單（☰），手機版展開完整連結
- `views/pages/cart.ejs`、`checkout.ejs`、`order-detail.ejs`：加入語義 class，手機版自動堆疊

**截圖存檔**（`docs/design/`）：
- 11 張桌面版截圖（actual-01 ～ actual-10）
- 4 張手機版響應式截圖（mobile-01 ～ mobile-04）
- `README.md` 索引（規範、金流流程、響應式對照表）

---

### 階段 10：E2E Skill 新增 E4（404 頁面）
**Commit** `e110c9e` E2E Skill 新增 E4：404 頁面功能驗證

新增第 12 項測試，驗證：
- 不存在路由觸發 404 頁面
- 無標準 Nav（設計稿專用 Nav）
- PAGE NOT FOUND eyebrow + 404 大字 + 標題文字
- 底部品牌文字
- 「回到首頁」按鈕正確導航

---

### 階段 11：E2E 驗收（首次執行）— 2026-06-06
**使用 Skill**：`e2e-payment-test`（12 項）

**結果：11 / 12，E4 失敗 ❌**

| 步驟 | 說明 | 結果 |
|------|------|------|
| Step 1 | 登入（設計稿專用 Nav，無標準 Header） | ✅ |
| Step 2 | 加入購物車（縮圖列 + 相關商品可見） | ✅ |
| Step 3 | 購物車 → 結帳（品牌+步驟 Nav） | ✅ |
| Step 4 | 填寫收件資訊送出 | ✅ |
| Step 5 | 網路 ATM / 台灣土地銀行 | ✅ |
| Step 6 | Save 完成模擬交易 | ✅ |
| Step 7 | 訂單詳情：付款方式「網路 ATM」自動填入 | ✅ |
| Step 8 | 訂單列表：商品摘要 + 側欄完整 | ✅ |
| E1 | 空購物車 → 跳轉 /cart | ✅ |
| E2 | 未登入 → 跳轉 /login?redirect=%2Forders | ✅ |
| E3 | 空白欄位送出 → 三欄錯誤提示 | ✅ |
| E4 | 404 頁面：**無簡化品牌 Nav（header / nav 元素均不存在）** | ❌ |

**E4 失敗細項**：
- 頁面標題含「找不到頁面」✅
- PAGE NOT FOUND eyebrow / 404 大字 / 找不到頁面標題 ✅
- 底部品牌文字 ✅
- 「← 回到首頁」在品牌 Nav 內 ❌（無 `<header>` 元素，只有內容區按鈕且無 ← 前綴）

---

### 階段 12：修正 404 Nav 並重新驗收 — 2026-06-06

**問題根因**：`app.js` 404 handler 以 `noHeader: true, noFooter: true` 渲染，使頁面無任何 header。`CHANGELOG.md` 與 `DESIGN_GAP.md` 均記錄「已完成」，但 `views/pages/404.ejs` 從未加入 header 元素，屬於遺漏。

**修正**：在 `views/pages/404.ejs` 頂部補入簡化 header，與 `checkout.ejs` 同一模式：

```html
<header style="background:#1A1A1A; border-bottom:1px solid rgba(255,255,255,0.06);">
  <div style="...height:72px; padding:0 48px;">
    <a href="/" class="font-display" style="...">花漾生活</a>
    <a href="/" class="font-ui" style="...">← 回到首頁</a>
  </div>
</header>
```

**同步文件更新**：
- `docs/CHANGELOG.md`：新增 `[1.2.1]` patch 版本
- `docs/DESIGN_GAP.md`：07 404 Footer 列 ⚠️ → ✅；設計差異說明排除 404
- `docs/PROJECT_JOURNEY.md`：本次更新

**重新驗收結果：12 / 12 全部通過 ✅**

| 步驟 | 說明 | 結果 |
|------|------|------|
| Step 1–8 | 正常金流流程 | ✅ × 8 |
| E1 | 空購物車 → 跳轉 /cart | ✅ |
| E2 | 未登入 → 跳轉 /login?redirect=%2Forders | ✅ |
| E3 | 空白欄位送出 → 三欄錯誤提示 | ✅ |
| E4 | 404 頁面：簡化 Nav（花漾生活 + ← 回到首頁）、內容正確、回到首頁跳轉正常 | ✅ |

---

## 四、重要錯誤修正記錄

### 問題 1：product-detail.js 共用 catch 導致頁面顯示「找不到此商品」
**原因**：新增 related API 呼叫後，若 API 不存在（伺服器未重啟），catch 區塊將 `notFound.value = true`，誤判商品不存在。
**修正**：將商品讀取與相關商品讀取分開為兩個獨立 try/catch，相關商品失敗靜默處理。

### 問題 2：結帳頁出現雙重 Nav（標準 Nav + 結帳 Nav）
**原因**：修改 `pageRoutes.js` 的 `noHeader` 旗標後未重啟伺服器，Node.js 模組快取仍執行舊路由代碼。
**修正**：重啟伺服器後生效。

### 問題 3：DB migration 未即時生效（payment_method 欄位）
**原因**：`database.js` 在伺服器啟動時執行 migration，若伺服器未重啟則新欄位不存在。
**修正**：重啟伺服器後欄位正常建立，`resolvePaymentMethod()` 可正確寫入。

### 問題 4：DESIGN_GAP.md blockquote 無換行
**原因**：Markdown 中連續兩行 `>` 會合併成同一段落，不會換行。
**修正**：在兩行 blockquote 之間插入空白 `>` 行，強制段落分隔。

### 問題 6：404 頁面 Nav 文件記錄完成但未實作
**原因**：v1.2.0 CHANGELOG 與 DESIGN_GAP.md 均記載「404 專用 Nav 已完成」，但 `views/pages/404.ejs` 從未加入 header 元素。`app.js` 雖已傳入 `noHeader: true` 正確跳過標準 Nav，卻忘記在 404 頁面內部補上自訂簡化 Nav。
**發現**：E2E Skill 執行 E4 測試時，`browser_evaluate` 確認 `document.querySelector('header')` 回傳 null，遂判定失敗。
**修正**：在 `views/pages/404.ejs` 頂部補入與 `checkout.ejs` / `login.ejs` 相同模式的簡化 header（品牌連結 + ← 回到首頁連結）。
**教訓**：文件記錄的「完成」需以可驗證的自動化測試為準，不能僅憑人工確認。

### 問題 5：design.pen 桌面版與磁碟不同步
**原因**：Pencil MCP 直接寫入磁碟，但桌面版 Pencil App 有未儲存的本地修改，可能導致衝突。
**修正**：每次 Pencil MCP 批次設計完成後，提醒使用者在桌面版按 `Cmd+S` 強制儲存同步。

---

## 五、設計決策備忘

| 決策 | 說明 |
|------|------|
| 「關於我們」無獨立頁面 | 設計稿 Nav 只有文字節點，無 URL；實作以 `/#story` 錨點連結首頁品牌故事區塊，符合設計意圖 |
| 結帳表單維持三欄 | 決定不實作聯絡電話、訂單備註，維持姓名/Email/地址三欄，降低填寫門檻 |
| Footer 保留於各內頁 | 設計稿部分內頁無 Footer，但實作保留完整 3 欄 Footer，提供一致導覽體驗 |
| 帳戶設定/收件地址前端暫存 | 帳戶資料修改暫不串接後端 API（`users` 表無對應修改端點），地址管理為 Vue 前端暫存 |
| 付款方式識別 | `resolvePaymentMethod()` 依 ECPay `PaymentType` 前綴映射中文（WebATM → 網路 ATM 等）|

---

## 六、最終頁面完成狀態

| 頁面 | 路由 | 狀態 |
|------|------|------|
| 首頁 | `/` | ✅ 全部完成 |
| 商品詳情 | `/products/:id` | ✅ 全部完成（含縮圖、相關商品） |
| 購物車 | `/cart` | ✅ 全部完成（含折扣行） |
| 結帳 | `/checkout` | ✅ 全部完成（含專用 Nav） |
| 登入 | `/login` | ✅ 全部完成（含專用 Nav） |
| 我的訂單 | `/orders` | ✅ 全部完成（含側欄用戶資訊、商品摘要） |
| 404 | `*` | ✅ 全部完成（含專用 Nav） |
| 訂單詳情 | `/orders/:id` | ✅ 全部完成（含小計行、付款方式） |
| 帳戶設定 | `/account` | ✅ 新增完成 |
| 收件地址 | `/address` | ✅ 新增完成 |

---

## 七、Git Commit 歷程

| Hash | 說明 |
|------|------|
| `4378517` | 初始化專案 |
| `796805c` | 新增前台所有頁面的 UI 設計稿（design.pen） |
| `56c96ca` | 將設計稿全面實作至所有前台 EJS 頁面 |
| `cdd131f` | 更新設計稿至桌面版 Pencil 最新版本，修正 CSS focus 輪廓 |
| `181421d` | 對齊設計稿與實際頁面的三處差異 |
| `cd58a73` | 修正登入頁面：卡片置中、背景圖正確 |
| `12259cf` | 全面對齊 EJS 實作與設計稿圖片及 Overlay 參數 |
| `3f5ca8a` | 修正「關於我們」連結指向首頁品牌故事區塊 |
| `fe2bd42` | 新增 .mcp.json MCP 伺服器設定 |
| `09e6479` | 更新 design.pen（桌面版 Pencil 最新儲存） |
| `565c978` | 新增設計稿缺口報告（DESIGN_GAP.md）並更新 .gitignore |
| `06a7ecb` | 修正結帳表單寬度，更新缺口報告 |
| `bde533e` | 新增 E2E 金流自動化測試 Skill |
| `3fa246e` | 實作設計稿缺口：補齊多頁面功能與 DB 欄位 |
| `6793be3` | 更新 DESIGN_GAP.md：標記已完成項目（含 design.pen amend） |
| `9322725` | 完成剩餘 5 項設計稿缺口實作 |
| `0556d90` | 更新 DESIGN_GAP.md：所有缺口項目已全數完成 |
| `9e1b1be` | 修正 DESIGN_GAP.md blockquote 換行格式 |
| `e189f4c` | 新增專案開發歷程知識庫（PROJECT_JOURNEY.md） |
| `4af97a6` | 新增設計截圖目錄（docs/design/）並實作響應式設計 |
| `9b7f975` | 補齊 .env.example：新增 PORT 與 NODE_ENV 說明 |
| `e110c9e` | E2E Skill 新增 E4：404 頁面功能驗證（11→12 項） |
| `df647ce` | 更新全套文件至 v1.2.0 最終狀態（CHANGELOG / ARCHITECTURE / DEVELOPMENT / TESTING / FEATURES） |
| — | E2E 測試執行（11/12，E4 404 Nav 缺漏） |
| — | 修正 `views/pages/404.ejs`：補入簡化品牌 Nav（v1.2.1） |
| — | 同步更新 CHANGELOG / DESIGN_GAP / PROJECT_JOURNEY 文件 |

---

## 八、相關文件索引

| 文件 | 路徑 | 說明 |
|------|------|------|
| 設計稿缺口報告 | `docs/DESIGN_GAP.md` | 設計稿 vs 實作完整比對，含已完成標記 |
| 功能清單 | `docs/FEATURES.md` | API 端點說明與業務邏輯 |
| 架構說明 | `docs/ARCHITECTURE.md` | 系統架構與目錄結構 |
| 開發規範 | `docs/DEVELOPMENT.md` | 命名規則與開發流程 |
| 測試指南 | `docs/TESTING.md` | Vitest 測試規範 |
| E2E 測試 Skill | `.claude/skills/e2e-payment-test/SKILL.md` | 觸發詞「跑 E2E 測試」，12 項自動化驗證（含 E4 404） |
| 設計截圖 | `docs/design/` | 11 張桌面 + 4 張手機截圖，含 README.md 索引 |
| 設計稿 | `design.pen` | Pencil MCP 設計檔（共 10 個頁面），保留根目錄 |
