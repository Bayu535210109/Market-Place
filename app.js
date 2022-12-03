const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const authenticateUser = require("./middlewares/authenticateUser");

const app = express();

require('./startup/db')();
require('./startup/middleware')(app);

// cookie session
app.use(
  cookieSession({
    keys: ["randomStringASyoulikehjudfsajk"],
  })
);

// route for serving frontend files
app
  .get("shop/index", (req, res) => {
    res.render("index");
  })
  .get("/loginuser", (req, res) => {
    res.render("loginuser");
  })
  .get("/register", (req, res) => {
    res.render("register");
  })
  .get("/loginseller", (req, res) => {
    res.render("loginseller");
  })
  .get("/home", authenticateUser, (req, res) => {
    res.render("home", { user: req.session.user });
  });

// route html web file
app.get('/',function (req, res){
  res.render('./shop/index');
});

app.get('/index',function (req, res){
  res.render('./shop/index');
});

app.get('/cart',function (req, res){
  res.render('./shop/cart');
});

app.get('/checkout',function (req, res){
  res.render('./shop/checkout');
});

app.get('/contact',function (req, res){
  res.render('./shop/contact');
});

app.get('/detail',function (req, res){
  res.render('./shop/detail');
});

app.get('/Seller',function (req, res){
  res.render('./shop/Seller');
});

app.get('/shop',function (req, res){
  res.render('./shop/shop');
});

// route product web

app.get('/H&M1',function (req, res){
  res.render('./product/H&M1');
});

app.get('/KidsStation',function (req, res){
  res.render('./product/KidsStation');
});

app.get('/Lacoste',function (req, res){
  res.render('./product/Lacoste');
});

app.get('/nike',function (req, res){
  res.render('./product/nike');
});

app.get('/Nikon',function (req, res){
  res.render('./product/Nikon');
});

app.get('/TomyHilfiger',function (req, res){
  res.render('./product/TomyHilfiger');
});

app.get('/wardah',function (req, res){
  res.render('./product/wardah');
});

app.get('/zara',function (req, res){
  res.render('./product/zara');
});

app.get('/Zara2',function (req, res){
  res.render('./product/Zara2');
});

app.get('/Zara3',function (req, res){
  res.render('./product/Zara3');
});

// route for handling post requirests
app
  .post("/login", async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) return res.send("Please enter all the fields");

    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) return res.send("invalid username or password");

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) return res.send("invalid username or password");

    // else he\s logged in
    req.session.user = {
      email,
    };

    res.redirect("/index");
  })
  .post("/register", async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) return res.send("Please enter all the fields");

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay) return res.send("A user with that email already exits please try another one!");

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ email, password: hashedPassword });

    latestUser
      .save()
      .then(() => {
        res.send("registered account!");
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  });

//logout
app.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

// server config
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started listening on port: ${PORT}`);
});
