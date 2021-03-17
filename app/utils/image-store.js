"use strict";

const cloudinary = require("cloudinary");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function () {
    const credentials = {
      cloud_name: process.env.name,
      api_key: process.env.key,
      api_secret: process.env.secret,
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function () {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  findImage: async function (imageId) {
    console.log("findImage Parameter: ", imageId);
    const result = await cloudinary.v2.api.resources_by_ids(imageId);
    return result.resources;
  },

  uploadImage: async function (imagefile) {
    console.log("Imagefile", imagefile);
    await writeFile("./public/temp.img", imagefile);
    const imageDetail = await cloudinary.uploader.upload(
      "./public/temp.img",
      function (error, result) {
        console.log("upload image image-store ", result, error);

        return result;
      }
    );

    console.log("Image URL: " + imageDetail.public_id);
    return imageDetail;
  },

  replaceImage: async function (imagefile) {
    await writeFile("./public/temp.img", imagefile);
    const imageDetail = await cloudinary.uploader.upload(
      "./public/temp.img",
      function (error, result) {
        console.log("Replace image ", result, error);
        return result;
      }
    );
    return imageDetail;
  },

  deleteImage: async function (imageId) {
    await cloudinary.v2.uploader.destroy(imageId, {});
  },
};

module.exports = ImageStore;
