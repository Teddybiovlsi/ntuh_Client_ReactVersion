import { post } from "../client/axios";

/**
 * 從 axios 錯誤物件中取出可顯示給使用者的訊息。
 *
 * 逾時、DNS 失敗、CORS 錯誤時 `error.response` 會是 undefined，
 * 直接讀取 `error.response.data.message` 會在 catch 區塊內二次拋錯。
 * 由於 axios 設有 5 秒 timeout，這在網路較慢時屬於常態而非邊緣案例。
 *
 * @param {Error} error - axios 拋出的錯誤物件。
 * @param {string} [fallback] - 無法取得後端訊息時顯示的預設文字。
 * @returns {string} 可直接顯示的錯誤訊息。
 * @version 1.0.0
 * @function getErrorMessage
 */
export const getErrorMessage = (error, fallback = "發生不明錯誤，請稍後再試") => {
  if (error?.code === "ECONNABORTED") {
    return "連線逾時，請稍後再試";
  }

  const data = error?.response?.data;
  if (data) {
    return data.message || data.error || fallback;
  }

  // 有發出請求但完全沒有收到回應：網路中斷 / DNS / CORS
  if (error?.request) {
    return "無法連線至伺服器，請檢查網路連線";
  }

  return error?.message || fallback;
};

/**
 * 透過 `axios` 套件，向後端發送上傳觀看次數請求。
 *
 * @param {string} permission - 使用者權限。
 * @param {string} token - 使用者權杖。
 * @param {string} videoID - 影片 ID。
 * @returns {Promise} 回傳 `Promise` 物件。
 * @version 1.0.0
 * @async
 * @function postViewCount
 */
export const postViewCount = async (permission, token, videoID) => {
  try {
    const url =
      permission === "ylhClient"
        ? `client/addcount/video/${token}`
        : `guest/view/video/${token}`;

    const response = await post(url, { videoID });
    return response;
  } catch (err) {
    return err;
  }
};

/**
 * 透過 `axios` 套件，向後端發送上傳觀看時間請求。
 *
 * @param {string} token - 使用者權杖。
 * @param {object} data - 上傳的資料，應該包含`videoID`、`watchTime`、`durationTime`三個屬性。
 * @returns {Promise} 回傳 `Promise` 物件。
 * @version 1.0.0
 * @async
 * @function postViewTime
 */
export const postViewTime = async ({ token, data }) => {
  try {
    const url = `client/updateTime/video/${token}`;
    const response = await post(url, data);
    return response.data.message;
  } catch (error) {
    return getErrorMessage(error);
  }
};
