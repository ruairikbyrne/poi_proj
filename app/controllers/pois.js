"use strict";
const Location = require("../models/location");
const Category = require("../models/category");
const ImageStore = require("../utils/image-store");

const POIs = {
  home: {
    handler: async function (request, h) {
      const category = await Category.find().lean();
      return h.view("home", {
        title: "Add a place of interest",
        category: category,
      });
    },
  },
  report: {
    handler: async function (request, h) {
      const locations = await Location.find().populate("category").lean();
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
      const location = await Location.findById(locationId)
        .populate("category")
        .lean();

      const category = await Category.find().lean();
      console.log("Category:", category);
      console.log("Location Details", location);
      return h.view("location", {
        title: "Add a place of interest",
        location: location,
        categories: category,
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
      try {
        const locationId = request.params._id;
        const file = request.payload.imagefile;
        console.log("File: ", file);
        const location = await Location.findById(locationId);
        const rawCategory = request.payload.category;
        const category = await Category.findOne({
          categoryName: rawCategory,
        });
        if (Object.keys(file).length > 0) {
          const result = await ImageStore.replaceImage(
            request.payload.imagefile
          );
          const locationEdit = request.payload;
          location.name = locationEdit.name;
          location.description = locationEdit.description;
          location.longitude = locationEdit.longitude;
          location.latitude = locationEdit.latitude;
          location.imageurl = result.url;
          location.imageid = result.public_id;
          location.category = category._id;
          await location.save();
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

  addLocation: {
    handler: async function (request, h) {
      try {
        const data = request.payload;
        const file = request.payload.imagefile;
        console.log("File: ", file);
        const rawCategory = request.payload.category;
        console.log("Raw Category: ", rawCategory);
        const category = await Category.findOne({
          categoryName: rawCategory,
        });
        console.log("Category: ", category);
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
            category: category._id,
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
