import { model, Schema, Types } from "mongoose";
const types = Schema.Types;

export interface Hero {
  name: { type: String };
  createdAt: { type: Date };
  github: {
    login: { type: string; required: true };
    name: string;
    avatar_url: string;
    blog: string;
    bio: string;
    followers: number;
  };
  short_bio: string;
  projects: Types.ObjectId[];
}

const fields = {
  name: { type: types.String }, // used to override the GitHub name (`mrdoob` has no name!)
  github: {
    login: { type: types.String, required: true },
    name: types.String,
    avatar_url: types.String,
    blog: types.String,
    bio: types.String,
    followers: types.Number,
  },
  createdAt: { type: types.Date, default: () => Date.now() },
  short_bio: types.String,
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
} as const;

export const HeroSchema = new Schema<Hero>(fields, { collection: "heroes" });

export const HeroModel = model<Hero>("Hero", HeroSchema);
