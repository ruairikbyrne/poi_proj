"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const categorySchema = Schema({
  categoryName: String,
});

categorySchema.statics.findByCategoryName = function (categoryName) {
  return this.findOne({ categoryName: categoryName });
};

module.exports = Mongoose.model("Category", categorySchema);
