//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Port = process.env.port || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      username: req.body.username,
      password: hash,
    });
    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function (req, res) {
  User.findOne({ username: req.body.username }, function (err, foundUser) {
    if (foundUser) {
      bcrypt.compare(
        req.body.password,
        foundUser.password,
        function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
        }
      );
    } else {
      console.log(err);
    }
  });
});

app.listen(Port, function () {
  console.log("Server is running at Port " + Port);
});
