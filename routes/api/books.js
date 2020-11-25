const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load Book and User models
const User = require("../../models/User");
const Book = require("../../models/Book");

router.post("/addBook", (req, res) => {
  //Fetch book details from the request body
  //Add this book to the user's list of owned books
  //Add this book to the Books collection in the database to be retrieved in search later

  console.log(req.body);

  const newBook = new Book({
    bookName: req.body.bookName,
    authorName: req.body.authorName,
    price: req.body.price,
    owner: req.body.owner, // TODO: Add the owner in the frontend later from redux
    condition: req.body.condition,
    comments: req.body.comments,
    imageURL: req.body.imageURL,
    address: req.body.address,
    zipCode: req.body.zipCode,
  });

  var bookId;

  User.findOne({ email: req.body.owner }).then((user) => {
    if (!user) {
      //if not present return
      return res.status(400).json({ err: "This user does not exist" });
    } else {
      //insert into books collection
      //insert into user's list of books
      newBook
        .save()
        .then((book) => {
          bookId = book._id;
          user.ownedBooks.push(bookId);
          user.save();
          res.json(book);
        })
        .catch((err) => console.log(err));
    }
  });
});

router.get("/searchBook", (req, res) => {
  //search using the requested string and return a list of result books
  var searchString = req.query.searchString;
  console.log(searchString);
  Book.find(
    { bookName: { $regex: searchString, $options: "i" } },
    function (err, docs) {
      if (err) {
        console.log(err);
        res.status(500).json({ err: "Could not find" });
      }

      console.log(docs);
      res.json(docs);
    }
  );
});

router.get("/getAllBooks", (req, res) => {

  Book.find({}, function(err, docs) {
    if (err) {
      console.log(err);
      res.status(500).json({ err: "Could not find" });
    }

    res.json(docs);
  });
});

router.get("/deleteBook", (req, res) => {
  var bookId = req.bookIdToDelete;

  Book.deleteOne({ _id: bookId }, function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({ err: "Could not find book" });
    }
    res.status(200);
  });
});



module.exports = router;
