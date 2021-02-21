const POIs = require("./app/controllers/pois");

module.exports = [
  { method: "GET", path: "/", config: POIs.index },
  { method: "GET", path: "/signup", config: POIs.signup },
  { method: "GET", path: "/login", config: POIs.login },
  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
  },
];
