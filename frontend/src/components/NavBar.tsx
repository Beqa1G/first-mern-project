import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "../models/user";
import NavBarLoggedOut from "./NavBarLoggedOut";
import NavBarLoggedIn from "./NavBarLoggedIn";

export interface NavBarProps {
  loggedInUser: User | null;
}

export default function NavBar({
  loggedInUser,
}: NavBarProps) {
  return (
    <Navbar bg="dark" variant="dark" expand="sm" sticky="top" >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Social media links app
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link as={Link} to="/privacy">
              Privacy
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {loggedInUser ? (
              <NavBarLoggedIn User={loggedInUser} />
            ) : (
              <NavBarLoggedOut
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
