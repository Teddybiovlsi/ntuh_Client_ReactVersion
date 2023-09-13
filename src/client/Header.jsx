import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import styles from "../styles/components/NavStyle.module.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsGlobeAmericas } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";

export default function Header({ expand = "lg" }) {
  const user = JSON.parse(
    localStorage?.getItem("user") || sessionStorage?.getItem("user")
  );

  const navigate = useNavigate();

  return (
    <Navbar
      collapseOnSelect
      id={styles.navBarContainer}
      expand={expand}
      className="mb-3"
      variant="light"
      fixed="top"
    >
      <Container fluid>
        <LinkContainer to="/Home">
          <Navbar.Brand>台大分院雲林分院衛教系統</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              選單
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto">
              {user !== null ? (
                <NavDropdown title="衛教資訊" id="collasible-nav-dropdown">
                  <LinkContainer to="/Pratice">
                    <NavDropdown.Item>練習用</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/test">
                    <NavDropdown.Item>測驗用</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}

              {/* 衛教天地Nav */}
              <Nav.Link href="https://www.ylh.gov.tw/?aid=625">
                衛教天地
              </Nav.Link>

              {/* 練習紀錄 */}
              {user !== null ? (
                <NavDropdown title="練習紀錄" id="collasible-nav-dropdown">
                  <LinkContainer to="/record/pratice">
                    <NavDropdown.Item>練習用</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/record/test">
                    <NavDropdown.Item>測驗用</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
              {/* 使用教學Nav */}
              {user !== null ? (
                <LinkContainer to="/usingTip">
                  <Nav.Link>使用教學</Nav.Link>
                </LinkContainer>
              ) : null}
              {/* 問題建議Nav */}
              {user !== null ? (
                <LinkContainer to="/comment">
                  <Nav.Link>問題建議</Nav.Link>
                </LinkContainer>
              ) : null}
            </Nav>
            {/* 語系選擇 不一定會做 */}
            {/* <Nav>
              <NavDropdown
                title={<BsGlobeAmericas />}
                id="collasible-nav-dropdown"
              >
                <LinkContainer to="/">
                  <NavDropdown.Item>中文</NavDropdown.Item>
                </LinkContainer>{" "}
                <LinkContainer to="/">
                  <NavDropdown.Item>英文</NavDropdown.Item>
                </LinkContainer>{" "}
              </NavDropdown>
            </Nav> */}
            <Nav>
              <NavDropdown
                title={
                  <>
                    設定
                    <AiFillSetting />
                  </>
                }
                id="collasible-nav-dropdown"
                align={{ lg: "end" }}
              >
                {user !== null ? (
                  <LinkContainer to="/setting">
                    <NavDropdown.Item>使用者設定</NavDropdown.Item>
                  </LinkContainer>
                ) : null}

                {user !== null ? (
                  <NavDropdown.Item
                    as={"button"}
                    onClick={() => {
                      localStorage.getItem("user") && localStorage.clear();
                      sessionStorage.getItem("user") && sessionStorage.clear();
                      navigate("/");
                    }}
                  >
                    登出
                  </NavDropdown.Item>
                ) : (
                  <LinkContainer to="/">
                    <NavDropdown.Item>登入</NavDropdown.Item>
                  </LinkContainer>
                )}
              </NavDropdown>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
