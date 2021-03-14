"use strict";

const POIs = require("./app/controllers/pois");
const Accounts = require("./app/controllers/accounts");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "GET", path: "/settings", config: Accounts.showSettings },

  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: "POST", path: "/settings", config: Accounts.updateSettings },

  { method: "GET", path: "/home", config: POIs.home },
  { method: "GET", path: "/report", config: POIs.report },
  { method: "GET", path: "/report/{_id}", config: POIs.deleteLocation },
  { method: "GET", path: "/gallery/{_id}", config: POIs.viewImage },
  { method: "GET", path: "/location/{_id}", config: POIs.showLocation },
  { method: "POST", path: "/location/{_id}", config: POIs.updateLocation },
  { method: "POST", path: "/poi", config: POIs.addLocation },
  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];
