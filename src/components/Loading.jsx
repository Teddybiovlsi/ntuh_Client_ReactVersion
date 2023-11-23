import React from "react";
import styles from "../styles/components/Loading.module.scss";
/**
 * 這個 component 主要使用於 顯示載入中的動畫效果。
 *
 * @param {Object} props - 組件的 props。
 * @param {string} [props.text="載入中"] - 載入中的文字。
 *
 * @returns {JSX.Element} 一個顯示載入中的動畫效果。
 * @version 1.0.0
 */

export default function Loading({ text = "載入中" }) {
  return (
    <>
      <div className={styles.loadingDivision}>
        <h1 className={`${styles.loadingDivision_headingText} me-3`}>{text}</h1>
        <div className={styles.dots}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
}
