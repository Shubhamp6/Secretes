//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFieds:["password"]});

const USER = mongoose.model("USER", userSchema);

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new USER({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  USER.findOne({ email: req.body.username }, function (err, foundUser) {
    if (err) {
      res.send(err);
    } else {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render("secrets");
        } else {
          res.send("Incorrect password");
        }
      } else {
        res.send("Username do not match");
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server started successfully on port 3000");
});
