import { model, Schema, Types } from "mongoose";
// const isAbsoluteURL = require("is-absolute-url");
// const isURL = require("validator/lib/isURL");

export type Project = {
  name: string;
  url: string;
  override_url: boolean;
  description: string;
  override_description: boolean;
  repository: string;
  tags: Types.ObjectId[];
  createdAt: Date;
  github: {
    name: string;
    full_name: string;
    description: string;
    homepage: string;
    stargazers_count: number;
    pushed_at: Date;
    last_commit: Date;
    branch: string;
    owner_id: number;
    topics: string[];
    commit_count: number;
    contributor_count: number;
    created_at: Date;
    archived: boolean;
    updatedAt: Date;
  };
  npm: {
    name: string;
    version: string;
    dependencies: string[];
    deprecated: boolean;
  };
  downloads: {
    monthly: number;
  };
  bundle: {
    name: string;
    dependencyCount: number;
    gzip: number;
    size: number;
    version: string;
    errorMessage: string;
  };
  packageSize: {
    name: string;
    installSize: number;
    publishSize: number;
    version: string;
    errorMessage: string;
  };
  logo: string;
  comments: string;
};

const fields = {
  name: { type: Schema.Types.String, required: true, unique: true },
  description: String,
  override_description: Boolean,
  repository: { type: Schema.Types.String, required: true, unique: true },
  url: String,
  override_url: Boolean,
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
  createdAt: { type: "Date", default: () => Date.now() },
  disabled: { type: Boolean, default: false },
  deprecated: { type: Boolean, default: false },
  github: {
    name: String,
    full_name: String,
    description: String,
    homepage: String,
    stargazers_count: Number,
    pushed_at: Date,
    last_commit: Date,
    branch: String,
    owner_id: Number,
    topics: Array,
    commit_count: Number,
    contributor_count: Number,
    created_at: Date,
    archived: Boolean,
    updatedAt: Date,
  },
  npm: {
    name: { type: "String" },
    version: { type: "String" },
    dependencies: [String],
    deprecated: { type: "Boolean" },
  },
  downloads: {
    monthly: Number,
  },
  bundle: {
    name: String,
    dependencyCount: Number,
    gzip: Number,
    size: Number,
    version: String,
    errorMessage: String,
  },
  packageSize: {
    name: String,
    installSize: Number,
    publishSize: Number,
    version: String,
    errorMessage: String,
  },
  logo: String,
  twitter: String,
  aliases: [String],
  comments: String
} as const;

const schema = new Schema<Project>(fields, { collection: "projects" });

schema.methods.toString = function () {
  return `${this.github.full_name} ${this._id}`;
};

// For some projects, override the description from GitHub that is not really relevant
schema.methods.getDescription = function () {
  const { description: gitHubDescription } = this.github;

  return gitHubDescription && !this.override_description
    ? gitHubDescription
    : this.description;
};

// schema.methods.getURL = function() {
//   if (this.override_url) return this.url;
//   const { homepage } = this.github;

//   return homepage && isValidProjectURL(homepage) ? homepage : this.url;
// };

export const ProjectModel = model<Project>("Project", schema);

// function isValidProjectURL(url) {
//   if (!isURL(url)) {
//     return false;
//   }
//   if (!isAbsoluteURL(url)) {
//     return false;
//   }

//   const invalidPatterns = [
//     "npmjs.com/", // the package page on NPM site is not a valid homepage!
//     "npm.im/",
//     "npmjs.org/",
//     "/github.com/", // GitHub repo page is not valid but GitHub sub-domains are valid
//     "twitter.com/"
//   ];

//   if (invalidPatterns.some(re => new RegExp(re).test(url))) {
//     return false;
//   }

//   return true;
// }
