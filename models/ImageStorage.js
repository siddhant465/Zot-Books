const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ImageStorageSchema = new Schema({
    bookImage: {
        type: Blob
    }
});

module.exports = ImageStorage = mongoose.model("images", ImageStorageSchema);
