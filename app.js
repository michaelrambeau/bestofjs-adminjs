const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AdminJSMongoose = require("@adminjs/mongoose");
require("dotenv").config();

const { Project, User } = require("./models");

const defaultPort = 2022;
const port = process.env.PORT || defaultPort;
const mongoURI = process.env.MONGO_URI_PRODUCTION;
const skipAuth = process.env.SKIP_AUTH === "1";
const cookiePassword = process.env.COOKIE_PASSWORD;

const app = express();

AdminJS.registerAdapter(AdminJSMongoose);

async function main() {
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
          listProperties: [
            "name",
            "npm.name",
            "tags",
            "disabled",
            "deprecated",
            "createdAt",
          ],
          sort: {
            sortBy: "createdAt",
            direction: "desc",
          },
          properties: {
            tags: {
              components: {
                list: AdminJS.bundle("./components/tag-list"),
              },
            },
          },
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
      User,
    ],
  });
  const basicRouter = AdminJSExpress.buildRouter(admin);
  const authRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });
      if (user) {
        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword,
  });

  const router = skipAuth ? basicRouter : authRouter;
  app.use(admin.options.rootPath, router);

  app.listen(port, () =>
    console.log(
      `AdminJS is under http://localhost:${port}/admin`,
      skipAuth ? "[No authentication mode]" : "[normal mode]"
    )
  );
}

main();
