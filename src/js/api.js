import { post } from "../client/axios";
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
    console.log(error.response);
    return error.response.data.message;
  }
};
