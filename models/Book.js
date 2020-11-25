const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BookSchema = new Schema({
  bookName: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    // required: true, //TODO: Make it required later, or add default image
    default:
      "https://st.depositphotos.com/1987177/3470/v/600/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg",
  },
  address: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
});

module.exports = Book = mongoose.model("books", BookSchema);
