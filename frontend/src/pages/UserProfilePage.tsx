import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userObject } from "../models/user";
import { fetchData } from "../network/fetchData";
import { Spinner } from "react-bootstrap";
import styles from "../styles/routes.module.css";

export default function UserProfilePage() {
  const { username } = useParams();

  const {
    data: User,
    isLoading,
    isError,
  } = useQuery<userObject>(["UserProfile", username], async () => {
    if (!username) {
      throw new Error("Username is missing");
    }
    const response = await fetchData("api/users/" + username, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      console.error("API Response Error:", response.statusText);
      throw new Error("Could not fetch Data!");
    }
    const responseData = await response.json();
    console.log("Fetched Data:", responseData); // Add this line
    return responseData;
  });

  console.log("user profile: ", User);

  return (
    <div>
      {isLoading && (
        <Spinner className={styles.loadingStates} animation="border" />
      )}
      {isError && <div>Error fetching user profile</div>}
      {User && (
        <div className={styles.profileCard}>
          <h2>User Profile</h2>
          <p className={styles.usernameP}>{User?.user.username}</p>
          <div className={styles.profileLinkCardWrapper}>
            {User?.links.map((link) => (
              <div key={link?._id} className={styles.profileLinkCard}>
                <a
                  className={`${styles.linkUrl} linkUrl`}
                  href={link.Url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.Url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
