import { UseMutationResult } from "@tanstack/react-query";
import { Button, Card, CloseButton, Form } from "react-bootstrap";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { link } from "../models/link";
import { linkInput } from "../network/links.api";
import styles from "../styles/link.module.css";

export interface linkFormProps {
  onDismiss(): void;
  formMethods: {
    register: UseFormRegister<linkInput>;
    handleSubmit: UseFormHandleSubmit<linkInput>;
    errors: FieldErrors<linkInput>;
    isSubmitting: boolean;
    reset: () => void;
  };
  createLinkMutation: UseMutationResult<link, unknown, linkInput, unknown>;
}

export default function LinkForm({
  onDismiss,
  formMethods,
  createLinkMutation,
}: linkFormProps) {
  const { register, errors, handleSubmit, isSubmitting, reset } = formMethods;

  const onSubmit = async (input: linkInput) => {
    try {
      await createLinkMutation.mutateAsync(input);
      reset();
      onDismiss();
    } catch (error) {
      console.error("An error occurred during link creation:", error);
    }
  };

  return (
    <>
      <Card className={styles.linkForm}>
        <Card.Header className={styles.linkFormHeader}>
          Enter Header and URL
          <CloseButton
            onClick={() => {
              onDismiss();
              reset();
            }}
          ></CloseButton>
        </Card.Header>
        <Form id="linkForm" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label className={styles.linkFormGroupLabel}>
              Enter Header
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Header"
              isInvalid={!!errors.header}
              className={styles.linkFormControl}
              {...register("header", { required: "Please enter Header" })}
            />
            <Form.Control.Feedback className={styles.marginLeft} type="invalid">
              {errors.header?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className={styles.linkFormGroupLabel}>
              Enter URL
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="URL"
              isInvalid={!!errors.Url}
              className={styles.linkFormControl}
              {...register("Url", { required: "Please enter URL" })}
            />
            <Form.Control.Feedback type="invalid" className={styles.marginLeft}>
              {errors.Url?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
        <Card.Footer>
          <Button type="submit" form="linkForm" disabled={isSubmitting}>
            Submit
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}
