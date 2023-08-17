import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";



export default function NavBarLoggedOut() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
    <Container>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
              <Nav.Link as={Link} to="/loginpage">Login</Nav.Link>
              <Nav.Link as={Link} to="/signuppage">Sign Up</Nav.Link>
            </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}