import _axios from "axios";

// API 位址與憑證改由環境變數提供（Vite 僅暴露 VITE_ 前綴的變數），
// 詳見專案根目錄的 .env.example。
//
// 注意：Vite 會在 build 時把 import.meta.env.* 直接內嵌進輸出的 JS，
// 因此這裡的值在瀏覽器端仍然是可見的，並非加密。
// 這麼做的目的是把設定與程式碼分離，讓日後更換只需改一個地方。
const DEFAULT_BASE_URL =
  "https://ilchp01.yuntech.edu.tw/ntuh_api/public/index.php/";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
const API_BASIC_AUTH = import.meta.env.VITE_API_BASIC_AUTH || "";

const axios = (baseURL, passType = "multipart/form-data") => {
  // 建立自訂義的axios
  const headers = {
    "Content-Type": passType,
    charset: "utf-8",
  };

  // 未設定憑證時不送出 Authorization header，避免送出格式不完整的空值
  if (API_BASIC_AUTH) {
    headers.Authorization = "Basic " + btoa(API_BASIC_AUTH);
  }

  const instance = _axios.create({
    baseURL: baseURL || API_BASE_URL,
    headers,
    timeout: 5000,
  });

  return instance;
};
// make axios get request api from the baseURL and /api/v1/GET/ + path
export const get = (path) => axios().get(`api/v1/GET/${path}`);
// make axios post request api from the baseURL and /api/v1/POST/ + path
export const post = (path, data) => axios().post(`api/v1/POST/${path}`, data);
// make axios put request api from the baseURL and /api/v1/PUT/ + path
export const put = (path, data) =>
  axios(API_BASE_URL, "application/x-www-form-urlencoded").put(
    `api/v1/PUT/${path}`,
    data
  );
// make axios delete request api from the baseURL and /api/v1/DELETE/ + path
export const del = (path) => axios().delete(`api/v1/DELETE/${path}`);

export { axios };
export default axios();
