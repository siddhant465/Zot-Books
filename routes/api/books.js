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

    const newBook = new Book ({
        bookName: req.body.bookName,
        author: req.body.author,
        price: req.body.price,
        owner: req.body.owner
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

router.get("/search", (req, res) => {

    //search using the requested string and return a list of result books
    var searchString = req.query.searchString;
    console.log(searchString)
    Book.find({bookName: {"$regex": searchString, "$options": "i"}}, function(err, docs)
        {
            if(err)
            {
                console.log(err);
                res.status(500).json({err: "Could not find"});
            }

            console.log(docs);
            res.json(docs)
        }
    );


});

router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists." });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      }); // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body); // Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password; // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found." });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect." });
      }
    });
  });
});

module.exports = router;
