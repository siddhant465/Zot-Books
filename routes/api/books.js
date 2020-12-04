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
      return res.status(404).json({ err: "This user does not exist" });
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

router.delete("/deleteBook", (req, res) => {
  var bookId = req.bookId;
  var ownerEmail, owner;

  Book.findById(bookId, function(err, book) {
    if(err){
      console.log(err);
      res.status(500).json({ error: "Could not find book" });
    }
    else{
      ownerEmail = book.owner;
      User.findById({email: ownerEmail}).then( (user) => {
        if(!user)
        {
          res.status(404).json({error: "User not found"});
        }
        else{
          owner = user;
          book.remove(function(err, result){
            if(err)
            {
              console.log(err);
              res.status(200).json({error: err});
            }
            var index = user.ownedBooks.indexOf(bookId);
            if (index > -1) {
              user.splice(index, 1);
              user.save();
            }
            return res.status(200);
          });
        }
      });
    }
  });
});

router.get("/getOneBook", (req, res) => {
  
  console.log(req);
  var bookId = req.query.bookId;

  Book.findById(bookId).then((book) => {
    if(!book)
    {
      res.err(404).json({error: "Book not found"});
    }
    else{
      res.json(book);
    }
  });

});

router.put("/updateBook", (req, res) => {
  
  var bookId = req.body.bookId;
  Book.findOneAndUpdate({_id: bookId}, req.body.bookToUpdate, {new: true}, function(err, result) {
    if(err)
    {
      console.log(err);
      res.json({error: err});
    }
    else{
      console.log(result);
      res.status(200).json();
    }
  });
})

router.get("/getAllListedBooks", (req, res) => {

  var owner = req.query.owner;

  User.findOne({email: owner}, function(err, user) {
    if(err)
    {
      console.log(err);
      res.status(404).json({error: "User not found"});
    }
    else{
      var books = []
      console.log(user.ownedBooks);
      Book.find({
        '_id': {$in: user.ownedBooks}
      }, function(err, books) {
        console.log(books);
        res.status(200).json(books);
      })      
    }

  });
})

module.exports = router;
