---
name: git-commit
description: 自動化 git commit 流程，分析變更內容、產生繁體中文 commit message、確認後提交。當使用者說「幫我 commit」、「commit 這次的變更」、「存檔」、「git commit」、「推版」、「commit 一下」、「幫我存版本」、「commit + push」、「commit 並推送」等關鍵詞時，立即觸發此 Skill，不要讓使用者手動輸入 git 指令。
---

# Git Commit 自動化

幫使用者完成 git commit 的完整流程，省去重複打指令的麻煩。目標是讓 commit message 既準確又符合專案風格，同時保護使用者不誤提交敏感檔案。

## 執行流程

### Step 1：確認有變更

```bash
git status
```

若輸出顯示「nothing to commit, working tree clean」→ 直接告知使用者「目前沒有需要 commit 的變更」，結束流程。

### Step 2：了解變更範圍

同時執行：
```bash
git diff --stat HEAD
git log --oneline -3
```

- `diff --stat` 告訴你改了哪些檔案、增減幾行
- `log` 讓你參考專案既有的 commit message 風格與用語習慣

### Step 3：確認 .gitignore 存在並分析版控適合性

#### 3-A：確認 .gitignore 是否存在

```bash
ls .gitignore 2>/dev/null && echo "exists" || echo "missing"
```

- **若不存在** → 提醒使用者：

  > ⚠️ 專案根目錄尚未建立 `.gitignore`，建議在 commit 前先建立，避免將 `node_modules/`、`.env`、`*.log` 等不必要的檔案納入版控。
  > 要現在幫你建立基本的 `.gitignore` 嗎？（或繼續直接 commit）

  若使用者說「幫我建立」，產生適合專案類型的基本 `.gitignore` 內容（Node.js 專案範本如下）並寫入檔案，再繼續流程：
  ```
  node_modules/
  .env
  .env.*
  !.env.example
  *.log
  npm-debug.log*
  coverage/
  .DS_Store
  dist/
  build/
  ```

#### 3-B：讀取 .gitignore 規則（若存在）

```bash
cat .gitignore
```

將規則內容納入後續判斷的參考依據。

#### 3-C：自動蒐集版控適合性資訊

同時執行以下三道指令，將結果提供給 LLM 分析：

```bash
# 未追蹤且「未被」.gitignore 涵蓋的檔案（最可能誤入版控的對象）
git ls-files --others --exclude-standard

# 已存在於工作目錄且「已被」.gitignore 忽略的檔案（確認保護範圍）
git ls-files --others --ignored --exclude-standard | head -30

# 目前所有變更的簡要狀態（M=已修改, A=新增, ?=未追蹤, D=刪除）
git status --short
```

#### 3-D：LLM 判斷層——版控適合性評估

根據上述資料，依照以下規則自動分類每個「未追蹤且未被忽略」的檔案：

| 類別 | 判斷條件 | 建議動作 |
|------|---------|---------|
| 🔴 **禁止入版控** | 符合敏感/環境/私鑰模式（見下方） | 詢問是否加入 `.gitignore` |
| 🟡 **建議排除** | 建置產物、快取、大型二進位、OS 暫存 | 詢問是否加入 `.gitignore` |
| 🟢 **適合入版控** | 原始碼、設定範本、文件、測試 | 正常 stage |
| ⚪ **待確認** | 無法自動判斷 | 逐一向使用者詢問 |

**🔴 禁止入版控的模式（硬規則）：**
- 環境變數：`.env`、`.env.*`（排除 `.env.example`）
- 私鑰憑證：`*.key`、`*.pem`、`*.p12`、`*.pfx`、`*.cert`、`id_rsa*`、`id_ed25519*`
- 資料庫實體：`*.db`、`*.sqlite`、`*.sqlite3`
- 含敏感字詞的檔名：`*secret*`、`*credential*`、`*password*`、`*token*`

**🟡 建議排除的模式：**
- 相依套件：`node_modules/`、`vendor/`、`.venv/`、`__pycache__/`
- 建置產物：`dist/`、`build/`、`out/`、`*.min.js`、`public/css/output.css`
- 測試覆蓋率：`coverage/`、`.nyc_output/`
- IDE / OS：`.DS_Store`、`Thumbs.db`、`.vscode/`、`.idea/`
- 日誌：`*.log`、`npm-debug.log*`
- 快取：`.cache/`、`.next/`、`.nuxt/`、`.turbo/`

#### 3-E：呈現分析結果

若發現有 🔴 或 🟡 類別的檔案，在繼續 commit 流程前，向使用者顯示：

```
📋 版控適合性分析報告
─────────────────────────────
🔴 建議絕對排除（共 N 個）：
  - .env.local（環境變數）
  - database.sqlite（資料庫實體）

🟡 建議加入 .gitignore（共 N 個）：
  - public/css/output.css（建置產物）

🟢 適合入版控（共 N 個）：
  - src/api/users.js
  - README.md

⚪ 請手動確認（共 N 個）：
  - uploads/avatar.png
─────────────────────────────
要幫你把 🔴🟡 的項目加入 .gitignore 嗎？（y/n）
```

若使用者同意，自動將對應規則附加到 `.gitignore` 末尾，再繼續流程。  
若全部為 🟢，靜默略過，直接進入 Step 4。

### Step 4：敏感檔案檢查

檢查未追蹤（untracked）或已修改的檔案中，是否包含：
- `.env`、`.env.*`（排除 `.env.example`）
- `*.key`、`*.pem`、`*.p12`、`*.pfx`
- 含有 `secret`、`credential`、`password` 的檔名

若有，在繼續前明確提醒使用者：「發現可能含敏感資訊的檔案：[列出清單]，確定要一起 stage 嗎？」等待確認。

### Step 5：產生 commit message

根據 diff 與 log 分析，自動草擬繁體中文 commit message：

**格式**：
```
<動詞><簡短說明>（50 字以內）

- <變更說明 1>
- <變更說明 2>
（若只有一項變更，body 可省略）

Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
```

**動詞選擇**：
- 新增 → 加入全新功能、檔案、頁面
- 修正 → 修 bug、修正錯誤行為
- 更新 → 調整現有功能、升級、改善
- 重構 → 不改功能只改結構
- 刪除 → 移除程式碼、檔案、功能
- 補齊 → 補上缺漏的欄位、文件、設定

**撰寫原則**：標題說 WHAT，body 說 WHY（改了什麼、為什麼改）。參考 `git log` 的既有風格讓訊息一致。

### Step 6：向使用者確認

將草擬的 commit message 顯示給使用者，詢問：

> 以上 commit message 是否 OK？（直接說「OK」或「好」即可，或告訴我要修改的地方）

等待使用者明確確認。若使用者要修改，照其意見調整後再次確認。

**若使用者在觸發時已提供 commit message**（例如：「幫我 commit，訊息是『修正登入 bug』」），直接使用該訊息，跳過自動生成，仍需確認一次。

### Step 7：執行 commit

確認後執行：

```bash
# Stage 全部變更（預設）
git add -A

# 若使用者要求只 stage 特定檔案，改為：
git add <指定檔案路徑>
```

然後以 HEREDOC 格式 commit：
```bash
git commit -m "$(cat <<'EOF'
<標題>

<body（若有）>

Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Step 8：顯示結果

顯示 commit hash 與摘要，例如：
> ✅ Commit 完成：`a1b2c3d` 更新訂單詳情付款方式欄位

---

## 進階選項

使用者在觸發時可加上這些關鍵詞：

| 使用者說 | 行為 |
|---------|------|
| 「commit 並推送」/ 「commit + push」 | commit 後自動執行 `git push origin main` |
| 「只 stage XXX」/ 「只加 XXX」 | 詢問確認後，只 stage 指定檔案 |
| 「訊息是 XXX」/ 「message：XXX」 | 直接用使用者提供的訊息 |
| 「amend」/ 「合併到上次」 | 執行 `git commit --amend --no-edit`（先確認） |

---

## 安全守則

- 不使用 `--no-verify`（不繞過 hooks）
- 不使用 `git push --force`（除非使用者明確要求，且再次確認）
- 若偵測到 `.env` 等敏感檔案，一定要提醒，不能靜默略過
