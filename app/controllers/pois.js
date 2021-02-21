const POIs = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add a place of interest" });
    },
  },
  report: {
    handler: function (request, h) {
      return h.view("report", {
        title: "Registered locations",
        locationInfo: this.locationInfo,
      });
    },
  },
  addLocation: {
    handler: function (request, h) {
      const data = request.payload;
      this.locationInfo.push(data);
      return h.redirect("/report");
    },
  },
};

module.exports = POIs;
