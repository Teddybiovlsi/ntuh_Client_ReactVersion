# 台大衛教系統 React 版本

- 衛教系統一共分成兩大項：
  - 使用者模式
  - 訪客模式

## 訪客模式

### 訪客模式將會有以下限制：

1. 無觀看紀錄
2. 無基礎練習／練習／測驗紀錄
3. 無更改設定功能

### 訪客模式流程

1. 透過訪客登入
2. Laravel API 進行溝通取得臨時權杖(Token)
3. 進入首頁中進行部分限制操作

## 使用者模式

### 使用者模式功能：

1. 可完整存取管理人員已勾選各類型(基礎練習/練習/測驗)影片與測驗題目
2. 可設定用戶名、變更密碼與變更信箱
3. 忘記密碼時，可透過忘記密碼功能透過信箱取回 OTP 密碼

### 使用者模式流程

1. 透過輸入帳號(病歷號)、密碼進行使用者登入
2. Laravel API 進行溝通取得權杖(若有按下記住我，則會依照權杖揮發日期進行確認)
3. 進行使用者登入操作

## 專案解說：

- **[src](./src/):** 專案主軸皆在此資料夾內
  - **[assets](./src/assets/):** 圖檔放置的位置
  - **[client](./src/client/):** 客戶端 web 功能
    - **[axios.jsx](./src/client/axios.jsx)** 負責與後端 API 溝通的檔案
    - **[Header.jsx](./src/client/Header.jsx)** 上方導覽列
    - **[Footer.jsx](./src/client/Footer.jsx)** 下方頁尾(暫時捨棄)
    - **[Form](./src/client/Form/):** 與使用者互動的表單有關功能會放置於此資料夾內
    - **[JSON](./src/client/JSON/):** 與使用者篩選器有關的引入資料會放置於此資料夾內
    - **[Pages](./src/client/Pages/):** 客戶端各個頁面的功能會放置於此資料夾內
      - **[Home.jsx](./src/client/Pages/Home.jsx):** 客戶端首頁
      - **[Login.jsx](./src/client/Pages/Login.jsx):** 客戶端登入頁面
      - **[ForgotPasswordForm.jsx](./src/client/Pages/ForgotPasswordForm.jsx):** 客戶端忘記密碼頁面
      - **[Record.jsx](./src/client/Pages/Record.jsx):** 客戶端練習/測驗紀錄頁面
      - **[RewritePassword.jsx](./src/client/Pages/RewritePassword.jsx):** 客戶端重設密碼頁面
      - **[UserComment.jsx](./src/client/Pages/UserComment.jsx):** 客戶端用戶回饋頁面
      - **[UserSetting.jsx](./src/client/Pages/UserSetting.jsx):** 客戶端用戶設定頁面
      - **[UserTips.jsx](./src/client/Pages/UserTips.jsx):** 客戶端使用教學頁面
      - **[VideoChapterPlayer.jsx](./src/client/Pages/VideoChapterPlayer.jsx):** 客戶端影片播放頁面
      - **[VideoList.jsx](./src/client/Pages/VideoList.jsx):** 客戶端影片列表頁面
      - **[VideoPlayer.jsx](./src/client/Pages/VideoPlayer.jsx):** 客戶端影片播放元件
  - **[components](./src/components/):** 整個專案頻繁調用的元件庫
  - **[js](./src/js/):** 整個專案頻繁調用功能如:轉換時間、API 調用、Modal 視窗 Hook
  - **[styles](./src/styles/):** 整個專案的樣式庫
  - **[App.jsx](./src/App.jsx):** 路由、未更改密碼提醒功能
  - **[AuthProtected.jsx](./src/AuthProtected.jsx)** 路由保護，用於確認使用者 LocalStorage 或 SessionStorage 當中是否存在用戶資料
  - **[PermissionProtected.jsx](./src/PermissionProtected.jsx)** 權限保護，避免訪客模式惡意嘗試無訪問權限路由
  - **[RewritePasswordProtected.jsx](./src/RewritePasswordProtected.jsx)** OTP 更改密碼保護，避免使用者在未輸入 OTP 認證碼情況下，惡意轉向修改密碼路由
  - **[main.jsx](./src/main.jsx):** [主頁](./index.html)所調用的 React 檔案，**此專案底下使用嚴謹模式**

## 專案注意事項：

**第一次使用時，請透過[github 連結](https://github.com/Teddybiovlsi/ntuh_Client_ReactVersion.git)下載 zip 檔案後，透過使用指令下載對應版本的套件**

```Terminal
npm i
```

**若要在本機執行本專案，請由 Terminal 執行以下指令**

```Terminal
npm run dev
```

專案底下的兩個檔案請勿直接進行修改!!，該檔案是由下載套件時自動生成
<br/>
兩個檔案內的資訊主要包含了當前使用 node 專案，如 vite、以及當前下載套件的版本號

- **[package-lock.json]**
- **[package.json]**

## 環境變數設定

API 位址與憑證由環境變數提供，不再寫死於程式碼中。

### 本機開發

複製 `.env.example` 為 `.env`（放在專案根目錄，與 `package.json` 同層）後填入實際值：

```bash
cp .env.example .env
```

| 變數 | 說明 |
| --- | --- |
| `VITE_API_BASE_URL` | 後端 API 位址，結尾需保留斜線 |
| `VITE_API_BASIC_AUTH` | Basic 驗證憑證，格式為 `帳號:密碼`（程式會自動做 base64，請勿自行編碼） |

`.env` 已列於 `.gitignore`，不會被提交。

### GitHub Actions 部署

部署由 `.github/workflows/deploy.yml` 自動執行，其環境變數來自 repo 的 secrets。
請至 **Settings → Secrets and variables → Actions → Repository secrets** 新增與上表同名的兩個項目。

若 `VITE_API_BASIC_AUTH` 未設定，workflow 會在建置前直接失敗並顯示錯誤訊息，
不會產出沒有 Authorization header 的版本。

> **注意**：Vite 在 build 時會把 `import.meta.env.*` 的值直接內嵌進輸出的 JavaScript，
> 因此這些值在瀏覽器端仍然看得到，使用環境變數只是把設定與程式碼分離、方便日後更換，
> 並非加密。若需要真正的機密性，必須改由後端代理，不能放在前端。

## 代辦事項

1. 新增基礎練習／練習／測驗整體完成率於影片清單中
2. 部分程式進行優化

## 製作團隊

本台大衛教系統係由 Dr.H.Group 研究團隊進行研發。<br>
v1.0.0 研發成員為：**顏銘德、高彬軒**<br>
本專案託管由：顏銘德負責，聯絡資訊：M11113005@yuntech.edu.tw

## 版本資訊

主要版本號：1.0.0<br>
