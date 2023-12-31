import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../models/user";
import { logout as signout } from "../network/users.api";
import styles from "../styles/routes.module.css";

export interface NavBarLoggedInProps {
  User: User;
}

export default function NavBarLoggedIn({
  User
}: NavBarLoggedInProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  
  const logoutMutation = useMutation(signout, {
    onSuccess: () => {
      queryClient.setQueryData(["loggedInUser"], null); // Clear the user data from cache
    },
  });



  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      navigate("/")
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    
    <Container>
      <Nav>
        <Nav className={styles.flex}>
          <Navbar.Text>Signed in as: {User.username}</Navbar.Text>
        </Nav>
        <Nav.Link as={Link} to="/usersettings" className="ms-2">
          Settings
        </Nav.Link>
        <Button variant="dark" onClick={handleLogout}>Sign out</Button>
      </Nav>
    </Container>
  );
}
