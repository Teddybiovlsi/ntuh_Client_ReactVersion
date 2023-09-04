import axios from "axios";

const createAxiosInstance = (baseURL, contentType = "multipart/form-data") => {
  // 建立自訂義的 axios 實例
  const instance = axios.create({
    baseURL: baseURL || "http://140.125.35.8:8079/ntuh_laravel_API/public/",
    timeout: 3000,
    headers: {
      "Content-Type": contentType,
      Accept: "application/json", // 接受 JSON 格式
    },
  });

  // 添加錯誤處理攔截器
  instance.interceptors.response.use(
    (response) => response.data, // 返回 API 響應的數據部分
    (error) => {
      // 处理错误，例如显示通知或记录错误
      console.error("API 請求錯誤:", error);
      throw error; // 返回 Promise 錯誤
    }
  );

  return instance;
};

const api = createAxiosInstance();

// 创建通用的请求函数
const makeRequest = (method, path, data) => {
  return api.request({
    method,
    url: `api/v1/${path}`,
    data,
  });
};

// 包装不同 HTTP 方法的请求
export const get = (path) => makeRequest("GET", path);
export const post = (path, data) => makeRequest("POST", path, data);
export const put = (path, data) => makeRequest("PUT", path, data);
export const del = (path) => makeRequest("DELETE", path);

export { api };
