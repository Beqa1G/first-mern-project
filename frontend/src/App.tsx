import { BrowserRouter, Navigate } from "react-router-dom";
import { Route, Routes } from "react-router";
import PrivacyPage from "./pages/PrivacyPage";
import LinksPage from "./pages/Linkspage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Container} from "react-bootstrap";
import MainPage from "./pages/MainPage";
import NavBar from "./components/NavBar";
import { useState } from "react";
import { User } from "./models/user";
import { getLoggedInUser } from "./network/users.api";
import SignUpSuccessPage from "./pages/SignUpSuccessPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import UserProfilePage from "./pages/UserProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    </>
  );
}

export function HomePage() {
  const [userRegistered, setUserRegistered] = useState(false);

  const {
    data: loggedInUser = null,
    isLoading,
    isFetching,
  } = useQuery<User | null>(["loggedInUser"], getLoggedInUser, {
    retry: false, // Disable automatic retries
    staleTime: 0, // Do not use cached data
  });

  return (
    <BrowserRouter>
      <div>
        <NavBar loggedInUser={loggedInUser} />
        <Container>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              path="/linksPage"
              element={
                isLoading || loggedInUser ? <LinksPage /> : <Navigate to="/loginpage" />
              }
            />

            <Route
              path="/loginpage"
              element={<LoginPage loggedInUser={loggedInUser} />}
            />

            <Route
              path="/signuppage"
              element={
                <SignUpPage
                  loggedInUser={loggedInUser}
                  onSignupSuccess={() => setUserRegistered(true)}
                />
              }
            />

            <Route
              path="/signupsuccess"
              element={
                userRegistered ? <SignUpSuccessPage /> : <Navigate to="/" />
              }
            />

            <Route
              path="/usersettings"
              element={
                isLoading || loggedInUser ? (
                  <UserSettingsPage
                    loggedInUser={loggedInUser}
                    isLoading={isLoading}
                    isFetching={isFetching}
                  />
                ) : (
                  <Navigate to="/loginpage" />
                )
              }
            />

            <Route path="/:username" element={<UserProfilePage />} />
            <Route element={<NotFoundPage />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}
