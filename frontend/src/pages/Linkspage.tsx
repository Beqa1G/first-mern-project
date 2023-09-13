import React, { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import SMLink from "../components/link";
import styles from "../styles/linksPage.module.css";
import styles1 from "../styles/link.module.css";
import {
  createLink,
  deleteLink,
  fetchLinks,
  linkInput,
  updateLink,
} from "../network/links.api";
import LinkForm from "../components/linkForm";
import { Button, Collapse, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { link as linkModel } from "../models/link";





export default function LinksPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();


  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<linkInput>();

  const {
    isLoading: isLoadingLinks,
    data: links,
    isFetching: isFetchingLinks,
    error: linksError,
  } = useQuery({
    queryKey: ["links"],
    queryFn: fetchLinks,
  });

  const createLinkMutation = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["links"],
      });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries(["links"]);
    },
  });

  const updateheaderMutation = useMutation({
    mutationFn: (updatedLink: linkModel) =>
      updateLink(updatedLink._id, updatedLink),
    onMutate: (updatedLink) => {
      const previousLinks = queryClient.getQueryData(["links"]);
      queryClient.setQueryData<linkModel[]>(["links"], (old) => {
        const updated = old?.map((link: linkModel) => {
          if (link._id === updatedLink._id) {
            return {
              ...link,
              header: updatedLink.header,
            };
          }
          return link;
        });
        return updated;
      });
      return previousLinks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["links"]);
    },
  });

  const updateUrlMutation = useMutation({
    mutationFn: (updatedLink: linkModel) =>
      updateLink(updatedLink._id, updatedLink),
    onMutate: (updatedLink) => {
      const previousLinks = queryClient.getQueryData(["links"]);
      queryClient.setQueryData<linkModel[]>(["links"], (old) => {
        const updated = old?.map((link: linkModel) => {
          if (link._id === updatedLink._id) {
            return {
              ...link,
              Url: updatedLink.Url,
            };
          }
          return link;
        });
        return updated;
      });
      return previousLinks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["links"]);
    },
  });

  function handleFormToggle() {
    setShowForm(!showForm);
  }

  const linksRow = (
    <Row xs={1} md={1} xl={1} className="w-75 p-3 g-2 mx-auto">
      {links?.map((link) => {
        return (
          <Col key={link._id}>
            <SMLink
              link={link}
              className={styles.link}
              deleteLinkMutation={deleteLinkMutation}
              updateHeaderMutation={updateheaderMutation}
              updateUrlMutation={updateUrlMutation}
            />
          </Col>
        );
      })}
    </Row>
  );

  if (linksError)
    return <div>"An error has occurred: " + linksError.message </div>;

  return (
    <>
      <Container>
        <Button variant="dark"
          className={`${styles.linkFormButton} ${styles1.flexCenter}`}
          onClick={() => {
            reset();
            handleFormToggle();
          }}
          aria-controls="example-fade-text"
          aria-expanded={showForm}
        >
          {showForm ? <AiOutlineMinus /> : <AiOutlinePlus />}
          {showForm ? "Cancel" : "Add Link"}
        </Button>

        <Collapse in={showForm}>
          <div id="example-fade-text">
            <LinkForm
              onDismiss={handleFormToggle}
              formMethods={{
                register,
                handleSubmit,
                errors,
                isSubmitting,
                reset,
              }}
              createLinkMutation={createLinkMutation}
            />
          </div>
        </Collapse>
        {isLoadingLinks || isFetchingLinks ? (
          <Spinner
            className={styles1.loadingStates}
            animation="border"
            variant="primary"
          />
        ) : links && links.length > 0 ? (
          linksRow
        ) : (
          <p className={styles1.loadingStates}>Add sum links bruv</p>
        )}
      </Container>
    </>
  );
}
