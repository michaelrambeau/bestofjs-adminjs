const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AdminJSMongoose = require("@adminjs/mongoose");
require("dotenv").config();

const { Project, Tag, User } = require("./models");

const mongoURI = process.env.MONGO_URI_PRODUCTION;
const app = express();

AdminJS.registerAdapter(AdminJSMongoose);

const run = async () => {
  if (!mongoURI) throw new Error(`No Mongo DB URI setup!`);
  console.log("Connecting", mongoURI.slice(0, 30));
  const connection = await mongoose.connect(mongoURI);
  const admin = new AdminJS({
    databases: [connection],
    rootPath: "/admin",
    branding: {
      companyName: "Best of JS Admin",
    },
    resources: [
      {
        resource: Project,
        options: {
          actions: {
            show: {
              // change the behavior of show action
            },
            myNewAction: {
              // create a totally new action
              actionType: "record",
              handler: () => {},
            },
          },
        },
      },
      { resource: Tag },
      User,
    ],
  });
  const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });
      if (user) {
        const matched = await bcrypt.compare(password, user.password);
        console.log(user, matched);
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword: "supersecret!",
  });
  app.use(admin.options.rootPath, router);
  const port = 2022;
  app.listen(port, () =>
    console.log(`AdminJS is under http://localhost:${port}/admin`)
  );
};
run();
