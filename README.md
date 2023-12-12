# 台大衛教系統 React版本
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
2. Laravel API進行溝通取得臨時權杖(Token)
3. 進入首頁中進行部分限制下操作
   

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
  - **[styles](./src/styles/):** 整個專案的樣式庫
  - **[App.jsx](./src/App.jsx):** 路由功能
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

## 代辦事項

暫無

## 製作團隊

本台大衛教系統係由 Dr.H.Group 研究團隊進行研發。<br>
研發成員為：顏銘德、高彬軒<br>
本專案託管由：顏銘德負責，聯絡資訊：M11113005@yuntech.edu.tw

## 版本資訊
主要版本號：1.0.0<br>
