import { useState } from "react";

/**
 * 自定義 Hook，用於管理互動視窗的顯示狀態。
 *
 * @returns {Array} 包含三個元素的陣列：
 * - 第一個元素是一個布林值，表示互動視窗是否顯示。
 * - 第二個元素是一個函數，用於關閉互動視窗。
 * - 第三個元素是一個函數，用於打開互動視窗。
 * @version 1.0.0
 */
const useModal = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return [show, handleClose, handleShow];
};

export default useModal;