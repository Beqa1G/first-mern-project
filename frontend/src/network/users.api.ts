import { User } from "../models/user";
import { fetchData } from "./fetchData";

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("/api/users/profile", {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export interface signUpCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function signUp(credentials: signUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response.json();
}

export interface loginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: loginCredentials): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response.json();
}

export async function logout() {
  await fetchData("api/users/logout", {
    method: "POST",
    credentials: "include",
  });
}



export async function deleteUser() {
  await fetchData("api/users/profile", {
    method: "DELETE",
    credentials: "include"
  })
}

export interface editUserCredentials {
  username: string;
  email: string;
  password: string;
}

export async function editUser(credentials: editUserCredentials) {
  await fetchData("api/users/profile", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
}

export async function getUserByUsername(username: string):Promise<User> {
  const response = await fetchData("api/users/" + username, {
    method: "GET",
    credentials: "include",
  })

  return response.json()
}