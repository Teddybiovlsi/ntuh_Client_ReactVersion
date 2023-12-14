import { AiFillSetting } from "react-icons/ai";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { PiPersonSimpleWalkBold } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";

import { clearUserSession, getUserSession } from "../js/userAction";
import styles from "../styles/components/NavStyle.module.scss";

import ImageOfYLHLogo from "../assets/ylhlogo.png";

export default function Header({ expand = "lg" }) {
  const user = getUserSession();

  const permission = user?.permission;

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
          <Navbar.Brand>
            <img
              src={ImageOfYLHLogo}
              alt="台大醫院雲林分院衛教系統"
              className={`d-inline-block align-top ${styles.logo}`}
              fluid="true"
            />
          </Navbar.Brand>
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
                <NavDropdown
                  title={
                    <>
                      衛教資訊
                      <IoMdArrowDropdown />
                    </>
                  }
                  id="collasible-nav-dropdown"
                >
                  <LinkContainer to="/basic">
                    <NavDropdown.Item>基礎練習</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/Pratice">
                    <NavDropdown.Item>練習</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/test">
                    <NavDropdown.Item>測驗</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}

              {/* 衛教天地Nav */}
              <Nav.Link href="https://www.ylh.gov.tw/?aid=612">
                衛教天地
              </Nav.Link>

              {/* 練習紀錄 */}
              {user !== null && permission === "ylhClient" ? (
                <NavDropdown
                  title={
                    <>
                      練習紀錄
                      <IoMdArrowDropdown />
                    </>
                  }
                  id="collasible-nav-dropdown"
                >
                  <LinkContainer to="/record/basic">
                    <NavDropdown.Item>基礎練習</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/record/pratice">
                    <NavDropdown.Item>練習</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/record/test">
                    <NavDropdown.Item>測驗</NavDropdown.Item>
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
                  <Nav.Link>滿意度調查</Nav.Link>
                </LinkContainer>
              ) : null}
              <LinkContainer to="/about">
                <Nav.Link>關於我們</Nav.Link>
              </LinkContainer>
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
              {user !== null ? (
                <NavDropdown
                  title={
                    <>
                      設定
                      <AiFillSetting />
                      <IoMdArrowDropdown />
                    </>
                  }
                  id="collasible-nav-dropdown"
                  align={{ lg: "end" }}
                >
                  {user !== null && permission === "ylhClient" ? (
                    <LinkContainer to="/setting">
                      <NavDropdown.Item>使用者設定</NavDropdown.Item>
                    </LinkContainer>
                  ) : null}

                  {user !== null && permission === "ylhClient" ? (
                    <NavDropdown.Item
                      as={"button"}
                      onClick={() => {
                        clearUserSession();
                        navigate("/");
                      }}
                    >
                      登出
                      <PiPersonSimpleWalkBold />
                    </NavDropdown.Item>
                  ) : (
                    <LinkContainer to="/">
                      <NavDropdown.Item>登入</NavDropdown.Item>
                    </LinkContainer>
                  )}
                </NavDropdown>
              ) : null}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
