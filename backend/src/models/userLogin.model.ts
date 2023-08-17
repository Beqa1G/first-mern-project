import mongoose from "mongoose";


export interface userLoginInput {
  username: string;
  password: string;
}

export interface userLoginDocument extends userLoginInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const userLoginSchema = new mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
},
{
    timestamps: true
}
);

const userLoginModel = mongoose.model<userLoginDocument>("authorization", userLoginSchema)

export default userLoginModel
