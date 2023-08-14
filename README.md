# 台大衛教系統 React version

## 台大衛教系統中主要包含兩大主軸：

- **[客戶端](./src/client/):** 登入、觀看影片功能、調閱練習紀錄、察看衛教資訊以及用戶回饋
- **[後臺管理端](./src/frontend_sys/):** 登入、(新增/編輯/修改/刪除)影片資訊卡、後台帳號、客戶端帳號、觀看客戶端練習情形

## 專案解說：

- **[src](./src/):** 專案主軸皆在此資料夾內
  - **[assets](./src/assets/):** 圖檔放置的位置
  - **[client](./src/client/):** 客戶端 web 功能
  - **[managed](./src/managed/):** 管理端 web 功能
  - **[shared](./src/shared/):** 整個專案頻繁調用的元件庫
  - **[App.jsx](./src/App.jsx):** 路由功能(以後會由導覽列 Nav 實現)(尚未實作)
  - **[main.jsx](./src/main.jsx):** [主頁](./index.html)所調用的 React 檔案，**此專案底下使用嚴謹模式**

## 專案注意事項：

**第一次使用時，請透過[github 連結](https://github.com/Teddybiovlsi/ntuh_ReactVersion)下載 zip 檔案後，透過使用指令下載對應版本的套件**

```Terminal
npm i
```
**若要在本機執行本專案，請由Terminal執行以下指令**

```Terminal
npm run dev
```
專案底下的兩個檔案請勿直接進行修改!!，該檔案是由下載套件時自動生成
<br/>
兩個檔案內的資訊主要包含了當前使用 node 專案，如 vite、以及當前下載套件的版本號

- **[package-lock.json]**
- **[package.json]**

## 代辦事項
- 管理端
  - 完成首頁選單功能(尚在實作中，新增功能已完成/編輯、刪除功能尚未完成)
  - 完成用戶端使用者管理功能(尚未實作)
  - 完成後台管理端使用者管理功能(尚未實作)
  - 完成紀錄管理功能(尚未實作)
- 用戶端
  - 尚未實作  

## 製作團隊
本台大衛教系統係由Dr.H.Group研究團隊進行研發。<br>
研發成員為：顏銘德、高彬軒<br>
本專案託管由：顏銘德負責，聯絡資訊：M11113005@yuntech.edu.tw
