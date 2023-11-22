import { useNavigate } from "react-router-dom";

/**
 * 取得用戶當前所儲存的資料。
 *
 * @returns {Object} 用戶的個人資料。
 * 如果用戶已登入，則會從瀏覽器的本地儲存或會話儲存中取得用戶的個人資料。
 * 如果用戶未登入，則會回傳 null。
 */
export const getUserSession = () => {
  const user = sessionStorage.getItem("user") || localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error("Failed to parse user data: ", error);
    }
  }
  return null;
};
/**
 * 儲存用戶資料到瀏覽器的儲存空間。
 *
 * @param {Object} userProfile - 用戶的個人資料。
 * @param {boolean} isRemember - 是否將資料儲存到本地：
 *   - true：將資料儲存到本地儲存，即使關閉瀏覽器，資料也會保留。
 *   - false：將資料儲存到會話儲存，當瀏覽器關閉時，資料將被清除。
 */
export const setUserSession = (userProfile, isRember = false) => {
  if (typeof userProfile !== "object" || userProfile === null) {
    throw new Error("userProfile must be a non-null object");
  }

  const userProfileString = JSON.stringify(userProfile);

  try {
    if (isRember) {
      localStorage.setItem("user", userProfileString);
    } else {
      sessionStorage.setItem("user", userProfileString);
    }
  } catch (error) {
    throw new Error("Failed to store user profile: " + error.message);
  }

  return userProfile;
};

/**
 * 若使用者登入後，伺服器回傳登入逾時或登出時，清除瀏覽器的本地儲存或會話儲存中的用戶資料。
 *
 * 會從兩個地方清除用戶資料，分別是：
 * 1. 本地儲存 (localStorage)
 * 2. 會話儲存 (sessionStorage)
 */
export const clearUserSession = () => {
  if (localStorage.getItem("user")) {
    localStorage.clear();
  }
  if (sessionStorage.getItem("user")) {
    sessionStorage.clear();
  }
};
