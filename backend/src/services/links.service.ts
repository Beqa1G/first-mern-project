import { QueryOptions, UpdateQuery } from "mongoose";
import linkModel, { linkDocument, linkInput } from "../models/link.model";

export async function getLink(id: string) {
  return linkModel.findById(id);
}

export async function createLinks(input: linkInput) {
  return linkModel.create(input);
}

export async function updateLink(
  id: string,
  update: UpdateQuery<linkDocument>,
  options: QueryOptions
) {
  return linkModel.findByIdAndUpdate(id, update, options);
}

export async function deleteLink(id: string) {
  return linkModel.findByIdAndDelete(id);
}
