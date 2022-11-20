// const mongoose = require("mongoose");

// const fields = {
//   name: String,
//   code: String,
//   description: String,
//   createdAt: {
//     type: Date
//   }
// };

// const schema = new mongoose.Schema(fields, {
//   collection: "tags"
// });

// const model = mongoose.model("Tag", schema);

// module.exports = model;

import { model, Schema } from "mongoose";
const types = Schema.Types

export interface Tag {
  name: string;
  code: string;
  description: string;
  createdAt: Date;
}

const fields = {
  name: { type: types.String, required: true },
  code: { type: types.String, required: true },
  description: { type: types.String },
  createdAt: { type: types.Date, default: () => Date.now() },
} as const;

export const TagSchema = new Schema<Tag>(fields, {collection: "tags"});

export const TagModel = model<Tag>("Tag", TagSchema);
