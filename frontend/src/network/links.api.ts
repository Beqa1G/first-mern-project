import { fetchData } from "./fetchData";
import { link } from "../models/link";

export async function fetchLinks(): Promise<link[]> {
    const response = await fetchData("/api/links", { method: "GET" });
    return await response.json();
  }
  
  export interface linkInput {
    header: string;
    Url: string;
  }
  
  export async function createLink(link: linkInput): Promise<link> {
    const response = await fetchData("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(link),
    });
  
    return response.json();
  }
  
  export async function deleteLink(linkId: string) {
    await fetchData("api/links/" + linkId, { method: "DELETE" });
  }
  
  export async function updateLink(
    linkId: string,
    link: linkInput
  ): Promise<link> {
    const response = await fetchData("/api/links/" + linkId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(link),
    });
    return response.json();
  }