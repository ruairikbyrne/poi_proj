"use strict";
const Location = require("../models/location");
const ImageStore = require("../utils/image-store");

const POIs = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add a place of interest" });
    },
  },
  report: {
    handler: async function (request, h) {
      const locations = await Location.find().lean();
      return h.view("report", {
        title: "Registered locations",
        locations: locations,
      });
    },
  },

  showLocation: {
    handler: async function (request, h) {
      console.log("POI ID ", request.params._id);
      const locationId = request.params._id;
      console.log("POI ID for mongoose query", locationId);
      const location = await Location.findById(locationId).lean();
      console.log("Location Details", location);
      //return h.view("location", { title: "Add a place of interest" });
      return h.view("location", {
        title: "Add a place of interest",
        location: location,
      });
    },
  },

  viewImage: {
    handler: async function (request, h) {
      try {
        const recordId = await Location.findById(request.params._id);
        console.log("Mongoose Record: ", recordId);
        const imageId = recordId.imageid;
        console.log("Image id from view Image: ", imageId);
        const allImages = await ImageStore.findImage(imageId);
        return h.view("gallery", {
          title: "Cloudinary Gallery",
          location: recordId.name,
          images: allImages,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  deleteLocation: {
    handler: async function (request, h) {
      try {
        const recordId = await Location.findById(request.params._id);
        console.log("Mongoose Record: ", recordId);
        const imageId = recordId.imageid;
        console.log("Image id from view Image: ", imageId);
        await ImageStore.deleteImage(imageId);
        await Location.deleteOne(recordId);
        return h.redirect("/report");
      } catch (err) {
        console.log(err);
      }
    },
  },

  updateLocation: {
    handler: async function (request, h) {
      console.log("POI ID ", request.params._id);
      const locationId = request.params._id;
      console.log("POI ID for mongoose query", locationId);
      const location = await Location.findById(locationId);
      console.log("Location Details", location);
      //return h.view("location", { title: "Add a place of interest" });
      const locationEdit = request.payload;
      location.name = locationEdit.name;
      location.description = locationEdit.description;
      location.longitude = locationEdit.longitude;
      location.latitude = locationEdit.latitude;
      await location.save();
      return h.redirect("/report");
    },
  },

  addLocation: {
    handler: async function (request, h) {
      try {
        const data = request.payload;
        const file = request.payload.imagefile;

        if (Object.keys(file).length > 0) {
          const result = await ImageStore.uploadImage(
            request.payload.imagefile
          );
          console.log("Image ID from calling method: " + result.url);
          const newLocation = new Location({
            name: data.name,
            description: data.description,
            longitude: data.longitude,
            latitude: data.latitude,
            imageurl: result.url,
            imageid: result.public_id,
          });

          await newLocation.save();
        }

        return h.redirect("/report");
      } catch (err) {
        console.log("Upload handler:", err);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
};

module.exports = POIs;
