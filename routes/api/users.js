const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const nodemailer = require("nodemailer");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
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
        address: req.body.address,
        zipCode: req.body.zipCode
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
          email: user.email,
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

router.post("/emailOwner", (req, res) => {
  const { toEmail, ccEmail, bookName, message } = req.body;

  // console.log("content");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "zotbooksuci@gmail.com",
      pass: "sexyboisid@forever69",
    },
  });

  const mailOptions = {
    from: "zotbooksuci@gmail.com",
    to: toEmail,
    subject: `You have a new request for your book: ${bookName}!`,
    html: `Hi!
    <br/>
    <br/>
    ${ccEmail} would like to connect with you regarding your recently listed book: 
    <br/>
    <b>${bookName}<b/>!
    <br/>
    <br/>
    <b>Message from buyer:</b>
    <br/>
    <i>${message}</i>
    <br/>
    <br/>
    *<b>Please contact the buyer using the email provided if interested.</b>*`,
    cc: [ccEmail],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: error });
    } else {
      res.json("Email successfully sent");
    }
  });
});

router.get("/getUserDetails", (req, res) => {
  var userEmail = req.query.email;
  console.log(userEmail);
  User.findOne({email: userEmail}, function(err, result) {

    if(err)
    {
      console.log(err);
      return res.status(500).json({error: err});
    }
    else if(!result)
    {
      return res.status(404)
    }
    else{
      console.log(result)
      return res.status(200).json({result: result});
    }
  })
})

router.put("/updateUser", (req, res)=> {

  var userEmail = req.body.email;
  var userDetails = req.body.userDetails;
  console.log(userDetails);
  User.findOneAndUpdate({email: userEmail}, userDetails, {new: true}, function(err, result) {
    if(err)
    {
      console.log(err);
      return res.json({error: err});
    }
    else{
      console.log(result);
      res.status(200).json(result);
    }
  })
})

module.exports = router;
