import { Container, Nav} from "react-bootstrap";
import { Link } from "react-router-dom";



export default function NavBarLoggedOut() {
  return (
    <Container>
          <Nav className="ms-auto">
              <Nav.Link as={Link} to="/loginpage">Login</Nav.Link>
              <Nav.Link as={Link} to="/signuppage">Sign Up</Nav.Link>
            </Nav>
    </Container>
  );
}