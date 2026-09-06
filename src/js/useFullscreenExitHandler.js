import { useEffect } from "react";

const FULLSCREEN_EVENTS = [
  "fullscreenchange",
  "webkitfullscreenchange",
  "mozfullscreenchange",
  "MSFullscreenChange",
];

/**
 * 監聽全螢幕狀態變化，離開全螢幕時把按鈕 icon 換回「進入全螢幕」樣式。
 *
 * 原本這段 addEventListener 直接寫在四個影片元件的 body 中，
 * 造成每次 render 都重新註冊、且從未移除，監聽器會無上限累積。
 * 改以 useEffect 註冊並在 cleanup 中移除，四個元件共用此 hook。
 *
 * @version 1.0.0
 */
export default function useFullscreenExitHandler() {
  useEffect(() => {
    const exitHandler = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement;

      if (isFullscreen) return;

      // 元件卸載或尚未掛載時這些元素可能不存在，需檢查後再操作
      const fullscreenBtn = document.getElementById("fullscreenBtn");
      if (fullscreenBtn) {
        fullscreenBtn.classList.replace(
          "vjs-icon-fullscreen-exit",
          "vjs-icon-fullscreen-enter"
        );
      }

      const playerContainer = document.getElementById(
        "video-container_Container_player"
      );
      if (playerContainer) {
        playerContainer.classList.remove("fullscreen");
      }
    };

    FULLSCREEN_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, exitHandler);
    });

    return () => {
      FULLSCREEN_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, exitHandler);
      });
    };
  }, []);
}
