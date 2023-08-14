import React, { useEffect, useRef, useState } from "react";
import { Form, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { post } from "../../client/axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import styles from "../../styles/pages/HomePage.module.scss";

export default function MultiAddUser() {
  // 建立一個參考變數
  const inputRef = useRef(null);
  // 存放excel檔案的資料
  const [sheetData, setSheetData] = useState([]);
  // 存放後台帳號建立狀況
  const [result, setResult] = useState([]);
  // 存放每頁顯示的資料筆數
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // 存放目前頁數
  const [currentPage, setCurrentPage] = useState(1);
  // 存放目前頁數的資料
  const [showData, setShowData] = useState(sheetData.slice(0, rowsPerPage));
  const [lastPage, setLastPage] = useState(1);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [uploadResult, setUploadResult] = useState(false);
  const handleCloseResult = () => setUploadResult(false);

  const readUploadFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        const rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        setSheetData(rowObject);
      });
    };
    reader.readAsBinaryString(file);
  };
  // 清除上傳的檔案
  const handleresetForm = (e) => {
    e.preventDefault();
    inputRef.current.value = null;
    setSheetData([]);
  };

  useEffect(() => {
    const rows = sheetData.length;
    setLastPage(Math.ceil(rows / rowsPerPage));
    setShowData(sheetData.slice(0, rowsPerPage));
  }, [sheetData, rowsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const start = (page - 1) * rowsPerPage;
    const end = start + Number(rowsPerPage);
    setShowData(sheetData.slice(start, end));
  };

  const handleSubmit = () => {
    // the sheetdata key must be the name of the "data" in the backend
    const data = {
      data: sheetData,
    };

    sendClientInfo(data);
  };

  const sendClientInfo = async (data) => {
    try {
      const clientSubmit = toast.loading("資料上傳中...");
      // 將Modal關閉
      setShow(false);
      const response = await post("clients", data);
      toast.update(clientSubmit, {
        render: "資料上傳成功",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setResult(response.data);
      setUploadResult(true);
    } catch (error) {
      toast.update(clientSubmit, {
        render: "資料上傳失敗",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container pb-4">
      <h1 className={styles.container_firstHeading}>批次新增帳號</h1>
      <div className="container">
        <Form.Group controlId="formFile">
          <Form.Label>
            <h2>
              <strong>請匯入批次建立帳號之excel檔案</strong>
            </h2>
          </Form.Label>

          <Form.Control
            ref={inputRef}
            type="file"
            name="videoFileInput"
            accept=".xlsx"
            onChange={readUploadFile}
          />
        </Form.Group>

        <BtnBootstrap
          variant="outline-secondary"
          type="reset"
          btnPosition="mt-3 mb-2 me-2"
          onClickEventName={handleresetForm}
          text="清除"
        />
        <BtnBootstrap
          variant="outline-primary"
          type="button"
          btnPosition="mt-3 mb-2 float-end"
          onClickEventName={() => {
            setShow(true);
          }}
          disabled={sheetData.length === 0}
          text="送出"
        />
      </div>
      {sheetData.length > 0 ? (
        <div>
          <Form.Select
            aria-label="請選擇每頁顯示筆數"
            className="float-end"
            style={{ width: "200px" }}
            onChange={(e) => {
              setRowsPerPage(e.target.value);
            }}
          >
            <option value="10">每頁顯示10筆</option>
            <option value="50">每頁顯示50筆</option>
            <option value="100">每頁顯示100筆</option>
          </Form.Select>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>姓名</th>
                <th>身分證字號</th>
                <th>電子信箱</th>
              </tr>
            </thead>
            <tbody>
              {showData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.personID}</td>
                    <td>{item.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={">"}
            previousLabel={"<"}
            onPageChange={(page) => handlePageChange(page.selected + 1)}
            pageCount={lastPage}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            containerClassName="justify-content-center pagination"
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      ) : null}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>請確認是否上傳</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>確認上傳請按確認鍵，否則請按X鍵</p>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            variant="outline-primary"
            type="submit"
            btnPosition="float-end"
            onClickEventName={handleSubmit}
            text="確認"
          />
        </Modal.Footer>
      </Modal>
      <Modal show={uploadResult} onHide={handleCloseResult}>
        <Modal.Header closeButton>
          <Modal.Title>上傳資訊</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>成功：{result.success}個</p>
            <p>重複：{result.repeat}個</p>
            {result.trash > 0 ? <p>於垃圾桶中：{result.trash}個</p> : null}
            <p>失敗：{result.fail}個</p>
          </div>
        </Modal.Body>
      </Modal>
      <ToastAlert />
    </div>
  );
}
