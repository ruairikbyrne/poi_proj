"use strict";

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Cookie = require("@hapi/cookie");
const Joi = require("@hapi/joi");
const env = require("dotenv");
const Handlebars = require("handlebars");
const ImageStore = require("./app/utils/image-store.js");

const server = Hapi.server({
  port: process.env.PORT || 3000,
});

const credentials = {
  cloud_name: process.env.name,
  api_key: process.env.key,
  api_secret: process.env.secret,
};

const result = env.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

async function init() {
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  //env.config();
  server.validator(require("@hapi/joi"));
  ImageStore.configure(credentials);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./app/views",
    layoutPath: "./app/views/layouts",
    partialsPath: "./app/views/partials",
    layout: true,
    isCached: false,
  });
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
  });
  server.auth.default("session");
  server.route(require("./routes"));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

require("./app/models/db");

init();
