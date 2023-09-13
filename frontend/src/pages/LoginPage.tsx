import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { login, loginCredentials } from "../network/users.api";
import styles from "../styles/routes.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface loginPageProps {
  loggedInUser: User | null;
}

export default function LoginPage({ loggedInUser }: loginPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginCredentials>();

  const loginMutation = useMutation<User, any, loginCredentials>(login, {
    onSuccess: (userData) => {
      queryClient.setQueryData(["loggedInUser"], userData);
      navigate("/");
    },
  });

  const onSubmit = async (credentials: loginCredentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
    } catch (error: any) {
      alert(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      {isSubmitting ? (
        <Spinner className ={styles.loadingStates} animation="border" role="status"  />
      ) : (
        <Card className={styles.loginCard}>
          <Form
            id="signup-page-form"
            className={styles.formWrapper}
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className={styles.signupFormheader}>Login</p>
            <div className={styles.signUpControlWrapper}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  isInvalid={!!errors.username}
                  className={styles.loginFormControl}
                  {...register("username", {
                    required: "Please enter your username",
                  })}
                />
                <Form.Control.Feedback
                  className={styles.marginLeft}
                  type="invalid"
                >
                  {errors.username?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="password"
                  isInvalid={!!errors.password}
                  className={styles.loginFormControl}
                  {...register("password", {
                    required: "Please enter your password",
                  })}
                />
                <Form.Control.Feedback
                  className={styles.marginLeft}
                  type="invalid"
                >
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </Form>
          <Button
            type="submit"
            form="signup-page-form"
            disabled={isSubmitting}
            className={styles.signupButton}
          >
            Login
          </Button>
          </Card>
      )}
  </>
  );
}
