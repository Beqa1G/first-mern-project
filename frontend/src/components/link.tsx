import styles from "../styles/link.module.css";
import { Card, Form } from "react-bootstrap";
import { link as linkModel } from "../models/link";
import { formatDate } from "../utils/formatDate";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit, AiOutlineCheck } from "react-icons/ai";
import { useState } from "react";
import { linkInput } from "../network/links.api";
import { useForm } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";

export interface linkProps {
  link: linkModel;
  className?: string;
  deleteLinkMutation: UseMutationResult<void, unknown, string, unknown>;
  updateHeaderMutation: UseMutationResult<
    linkModel,
    unknown,
    linkModel,
    unknown
  >;
  updateUrlMutation: UseMutationResult<linkModel, unknown, linkModel, unknown>;
}

export default function SMLink({
  link,
  className,
  deleteLinkMutation,
  updateHeaderMutation,
  updateUrlMutation,
}: linkProps) {
  const { header, Url, createdAt, updatedAt, _id } = link;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<linkInput>();

  const [isEditingHeaderMode, setIsEditingHeaderMode] = useState(false);
  const [isEditingUrlMode, setIsEditingUrlMode] = useState(false);

  let createdUpdatedDate: string;
  if (updatedAt > createdAt) {
    createdUpdatedDate = "Updated : " + formatDate(updatedAt);
  } else {
    createdUpdatedDate = "Created : " + formatDate(createdAt);
  }

  const handleDeleteLink = async (link: linkInput) => {
    try {
      await deleteLinkMutation.mutateAsync(_id);
    } catch (error) {
      console.error("An error occurred during link deletion", error);
    }
  };

  const handleHeaderUpdate = async (updatedHeader: linkInput) => {
    try {
      await updateHeaderMutation.mutateAsync({
        ...link,
        header: updatedHeader.header,
      });
      setIsEditingHeaderMode(false);
    } catch (error) {
      console.error("An error occurred during URL update", error);
    }
  };

  const handleUrlUpdate = async (updatedUrl: linkInput) => {
    try {
      await updateUrlMutation.mutateAsync({
        ...link,
        Url: updatedUrl.Url,
      });
      setIsEditingUrlMode(false);
    } catch (error) {
      console.error("An error occurred during URL update", error);
    }
  };

  return (
    <Card className={`${styles.linkCard} ${className}`}>
      <Card.Body className={`${styles.linkBody}`}>
        {isEditingHeaderMode ? (
          <>
            <Form
              className={styles.flexCenter}
              id="headerForm"
              onSubmit={handleSubmit(handleHeaderUpdate)}
            >
              <Form.Control
                isInvalid={!!errors.header}
                {...register("header", { required: "Please update header" })}
              />
              <Form.Control.Feedback
                className={styles.marginLeft}
                type="invalid"
              >
                {errors.header?.message}
              </Form.Control.Feedback>
              <button
                type="submit"
                className={styles.iconButton}
                form="headerForm"
                disabled={isSubmitting}
              >
                <AiOutlineCheck />
              </button>
            </Form>
          </>
        ) : (
          <Card.Text
            className={`${styles.linkHeader} ${styles.flexCenter}`}
            onClick={() => {
              setIsEditingHeaderMode(true);
              setValue("header", header);
            }}
          >
            {header}
            <AiOutlineEdit />
            <MdOutlineDeleteOutline
              className="ms-auto"
              onClick={(e) => {
                handleDeleteLink(link);
                e.stopPropagation();
              }}
            />
          </Card.Text>
        )}
        {isEditingUrlMode ? (
          <Form className={styles.flexCenter} id="UrlForm" onSubmit={handleSubmit(handleUrlUpdate)}>
            <Form.Control
              isInvalid={!!errors.Url}
              {...register("Url", { required: "Please edit Url" })}
            />
            <Form.Control.Feedback className={styles.marginLeft} type="invalid">
              {errors.Url?.message}
            </Form.Control.Feedback>
            <button
              type="submit"
              className={styles.iconButton}
              form="UrlForm"
              disabled={isSubmitting}
            >
              <AiOutlineCheck />
            </button>
          </Form>
        ) : (
          <Card.Text
            className={styles.linkUrl}
            onClick={() => {
              setIsEditingUrlMode(true);
              setValue("Url", Url); //
            }}
          >
            {Url}
            <AiOutlineEdit />
          </Card.Text>
        )}
      </Card.Body>
      <Card.Footer className={styles.linkFooter}>
        {createdUpdatedDate}
      </Card.Footer>
    </Card>
  );
}
