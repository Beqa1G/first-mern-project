import mongoose from "mongoose";
import { UserDocument } from "./user.model";
/* import { InferSchemaType } from "mongoose"; */

  export interface linkInput {
  userId: UserDocument["_id"];
  header: string;
  Url: string;
}

export interface linkDocument extends linkInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}  

// what if i did it like this instead of InferSchemaType

const linkSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    header: { type: String, required: true },
    Url: { type: String, required: true },
  },
  { timestamps: true }
);

//type socialMediaLink = InferSchemaType<typeof linkSchema>;

const linkModel = mongoose.model<linkDocument>("Links", linkSchema)

//const linkModel = mongoose.model<socialMediaLink>("Links", linkSchema)

export default linkModel
