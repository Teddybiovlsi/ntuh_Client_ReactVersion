  /**
   * 轉換時間戳記為格式化日期格式或時間字串。
   *
   * @param {number} time - 資料庫所回傳的時間戳記.
   * @param {string} type - 要進行的轉換類型。
   *                        如果為 "date"，則函數返回日期字串。
   *                        如果為 "time"，則函數返回時間字串。
   * @returns {string} 格式化的日期或時間字串。
   */
  export const convertTimestampToDateOrTime = (time, type) => {
    if (type === "date") {
      return new Date(time).toLocaleDateString();
    }
    if (type === "time") {
      return new Date(time).toLocaleTimeString();
    }
  };