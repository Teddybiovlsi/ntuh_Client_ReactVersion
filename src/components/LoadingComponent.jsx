import React from "react";
import Loading from "./Loading";
import { Container } from "react-bootstrap";
import styles from "../styles/components/Common.module.scss";

/**
 * 這個 component 結合 Loading component並包含一個標題在內，主要使用於 Loading 頁面。
 *
 * @param {Object} props - 組件的 props。
 * @param {string} [props.title="資訊欄位"] - 該頁面的標題。
 * @param {string} [props.text="Loading"] - 載入中的文字。
 *
 * @returns {JSX.Element} 一個顯示標題與載入中文字的動畫效果。
 */

export default function LoadingComponent({
  title = "資訊欄位",
  text = "Loading",
}) {
  return (
    <Container>
      <h1 className={styles.container_firstHeading}>{title}</h1>
      <div className={styles.container_division}>
        <h2 className={styles.container_division_secondHeading}>
          <Loading text={text} />
        </h2>
      </div>
    </Container>
  );
}
