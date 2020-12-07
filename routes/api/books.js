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
  var bookId = req.query.bookId;
  var ownerEmail;

  Book.findById(bookId, function(err, book) {
    if(err)
    {
      console.log(err);
      res.status(500).json(err);
    }
    else{
      if(!book)
      {
        res.status(404).json({error: "Book not found"});
      }
      ownerEmail = book.owner;
      console.log(ownerEmail)
      User.findOne({email: ownerEmail}).then( (user) => {
        if(!user)
        {
          res.status(404).json({error: "User not found"});
        }
        else{
          book.remove(function(err, result){
            if(err)
            {
              console.log(err);
              return res.status(500).json({error: err});
            }
            var index = user.ownedBooks.indexOf(bookId);
            if (index > -1) {
              user.ownedBooks.splice(index, 1);
              user.save();
            }
            console.log(user);
            return res.status(200).json(user);
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
      return res.status(500).json(err);
    }
    else{
      if(!user)
      {
        return res.status(404).json({error: "User not found"});
      }
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

router.get("/getWishlistedBooks", (req, res) => {

  var userEmail = req.query.userEmail;

  User.findOne({email: userEmail}, (err, user) => {
    if(err)
    {
      console.log(err);
      return res.status(500).json(err);
    }
    else{
      if(!user)
      {
        return res.status(404).json({error: "User not found"});
      }
      Book.find({

        //TODO: Add lazy delete functionality
        '_id': {$in: user.wishlistBooks}
      }, function(err, books) {
        console.log(books);
        return res.status(200).json(books);
      })
    }
  })
})

router.put("/addToWishlist", (req, res) => {

  var userEmail = req.body.userEmail;
  var bookId = req.body.bookId;

  User.findOne({email: userEmail}, function(err, user) {
    if(err)
    {
      console.log(err);
      return res.status(500).json(err);
    }
    else{
      if(!user)
      {
        return res.status(404).json({error: "User not found"});
      }
      user.wishlistBooks.push(bookId);
      user.save();
      return res.status(200).json(user.wishlistBooks);
    }
  })
})

router.delete("/removeFromWishlist", (req, res) => {

  var userEmail = req.query.userEmail;
  var bookId = req.query.bookId;

  User.findOne({email: userEmail}, function(err, user) {
    if(err)
    {
      console.log(err);
      return res.status(500).json(err);
    }
    else{
      if(!user)
      {
        return res.status(404).json({error: "User not found"});
      }
      var index = user.wishlistBooks.indexOf(bookId);
      console.log(index)
      if (index > -1) {
        user.wishlistBooks.splice(index, 1);
        user.save();
      }
      return res.status(200).json(user.wishlistBooks);
    }
  })
})

module.exports = router;
