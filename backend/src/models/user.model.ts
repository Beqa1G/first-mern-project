import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserInput {
  email: string;
  username: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  // eslint-disable-next-line prefer-const
  let user = this as UserDocument;

  if (!user.isModified("password")) return next();

  const hashedPassword = bcrypt.hashSync(user.password, 10);

  user.password = hashedPassword;

  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password);
};

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
