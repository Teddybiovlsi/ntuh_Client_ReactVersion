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
import { Link } from "react-router-dom";
import { BsGlobeAmericas } from "react-icons/bs";

export default function Header({ expand = "lg" }) {
  // const [user, setUser] = useState(JSON.parse(localStorage?.getItem("user")));
  // // const expTimeFormat = Date.parse(Date(user.expTime));
  // // const nowTimeFormat = Date.now();
  // // console.log("expTimeFormat", expTimeFormat);
  // // console.log("nowTimeFormat", nowTimeFormat);
  // // console.log("compare", new Date(user?.expTime) > new Date());
  // // useEffect(() => {
  // //   console.log("user", user);
  // // }, [user]);

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
        <LinkContainer to="/">
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
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto">
              <NavDropdown title="衛教資訊" id="collasible-nav-dropdown">
                <LinkContainer to="/">
                  <NavDropdown.Item>練習用</NavDropdown.Item>
                </LinkContainer>{" "}
                <LinkContainer to="/">
                  <NavDropdown.Item>測驗用</NavDropdown.Item>
                </LinkContainer>{" "}
              </NavDropdown>
              {/* 衛教天地Nav */}
              <LinkContainer to="/">
                <Nav.Link>衛教天地</Nav.Link>
              </LinkContainer>
              {/*  */}
              {/* 問題建議Nav */}
              <LinkContainer to="/comment">
                <Nav.Link>問題建議</Nav.Link>
              </LinkContainer>
            </Nav>
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
            {/* <Nav>
              {user !== null && (
                <div className="d-flex align-items-center justify-content-center me-2">
                  <p className="m-0 ">{`${user.name}你好`}</p>
                </div>
              )}
              {user !== null ? (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null);
                  }}
                >
                  登出
                </Button>
              ) : (
                <Link to="/">
                  <Button variant="outline-primary">登入</Button>
                </Link>
              )}
            </Nav> */}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
