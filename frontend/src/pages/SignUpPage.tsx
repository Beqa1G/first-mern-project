import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import styles from "../styles/routes.module.css";
import { signUpCredentials, signUp } from "../network/users.api";
import { useMutation } from "@tanstack/react-query";
import { User } from "../models/user";


export interface SignUpPageProps {
  loggedInUser: User | null
  onSignupSuccess(): void
}

export default function SignUpPage({ loggedInUser, onSignupSuccess }: SignUpPageProps) {
  const navigate = useNavigate();

  if(loggedInUser) {
    navigate("/")
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signUpCredentials>();

  const signUpMutation = useMutation(signUp);

  async function onSubmit(credentials: signUpCredentials) {
    try {
      await signUpMutation.mutateAsync(credentials);
      navigate("/signupsuccess");
      onSignupSuccess()
    } catch (error: any) {
        alert(error.message)
        console.error(error.message);
    }
  }


  return (
    <Card className={styles.signupCard}>
      <Form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        <p className={styles.signupFormheader}>Create New Account</p>
        <div className={styles.signUpControlWrapper}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              isInvalid={!!errors.username}
              className={styles.signupFormControl}
              {...register("username", {
                required: "Please enter your username",
              })}
            />
            <Form.Control.Feedback className={styles.marginLeft} type="invalid">
              {errors.username?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              isInvalid={!!errors.email}
              placeholder="email"
              className={styles.signupFormControl}
              {...register("email", { required: "Please enter your email" })}
            />
            <Form.Control.Feedback className={styles.marginLeft} type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="password"
              isInvalid={!!errors.password}
              className={styles.signupFormControl}
              {...register("password", { required: "password is required" })}
            />
            <Form.Control.Feedback className={styles.marginLeft} type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              isInvalid={!!errors.confirmPassword}
              className={styles.signupFormControl}
              {...register("confirmPassword", {
                required: "please confirm the password",
              })}
            />
            <Form.Control.Feedback className={styles.marginLeft} type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <Button
          type="submit"
          className={styles.signupButton}
          disabled={isSubmitting}
        >
          Register
        </Button>
      </Form>
    </Card>
  );
}
