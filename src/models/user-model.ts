import { model, Schema, Types } from "mongoose";

export interface User {
  email: string;
  password: string;
}

const fields = {
  email: { type: "String", required: true },
  password: { type: "String", required: true },
} as const;

export const UserSchema = new Schema<User>(fields, { collection: "users" });

export const UserModel = model<User>("User", UserSchema);
