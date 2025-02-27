require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const fs = require("fs");
const path = require("path");
let data = require('./mongodb/connection.js');
app.use(express.static("./views/Banner"));
const login = require("./login.js");
const signup = require('./signup.js');
const cookieparser = require("cookie-parser");
const session = require("express-session");
app.use(cookieparser());
const oneday = 1000 * 60 * 60 * 24;
app.set("view engine", "ejs")
//*session management :

app.use(
  session({ 
    saveUninitialized: true,
    resave: false,
    secret: "askjh34asdf345#@#43",
    cookie: { maxAge: oneday },
  })
);
//*route and authentication middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/productImage")));
app.use(express.static(path.join(__dirname, "/comment")));
app.use(express.static(path.join(__dirname, "/profilepic")));

const userRoute = require("./router/userRoutes.js");
const adminRoute = require("./router/adminRoutes.js");
// const paymentRoute = require('./router/paymentRoute.js');
// app.use('/payment',paymentRoute);

app.use("/users", userRoute);  //user route
app.use("/admin", adminRoute); //admin ro
//*session-authentication 
function auth(req, res, next) {
  if (req.session.email)
    next();
  else res.redirect("/");
}

app.use(express.static("public"));



//*logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


app.get("/", async (req, res, next) => {
  console.log(req.session.email);
  let products = await data.collection('products').find().toArray();
  // let products=await data.collection("products").find({}).toArray();
  let x = [];
  products.forEach((item) => {
    if (item.brand != undefined)
      x.push(item.brand);
  })
  let brands = new Set(x);
  res.render("index", { products: products, brands: brands });
});

//*log-in
app.use('/login', login);

//*signup
app.use('/signup', signup); 

//*Update password

app.get('/changepwd', (req, res) => {
  res.render('changepwd');
})
app.post('/changepwd', (req, res) => {
  if (req.body.newPass == req.body.conPass) {
    console.log(req.body);
  }
  res.end();
})    

data(function (res) { 
  if (data) data = res;
  else {
    console.log("not valid user");
  }
});

app.get('/api',(req,res)=>{
res.json({message:`api is running is`})
})
app.listen(PORT, (err) => {
  console.log(`Server running on port number ${PORT}`);
  console.log('Mongoose is connected');
  // console.log('Mongoose is connected');
});
