const express = require("express");
const session = require("express-session");
var cookieParser = require('cookie-parser');
const MongoDBSession = require("connect-mongodb-session")(session);
require("dotenv").config();
const mongoConnect = require("./util/database").mongoConnect;

const store = new MongoDBSession({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
const app = express();


app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());  

app.use(
  session({
    secret: "secret",
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    },  
    store: store
  })
);

const isAuth = require("./middleware/is-auth");
const controller = require("./controllers/controller");

app.get("/", controller.getAllUsers);
app.get("/dashboard", isAuth, controller.getUserDashboard);
app.post("/login", controller.loginUser);
app.post("/register", controller.requestForUserCreation);
app.post("/validate", controller.createUser);
app.post("/logout", controller.logout);
app.post('/update', isAuth, controller.updateUser);

mongoConnect(() => {
  app.listen(8000, () => {
    console.log(`Server started on 8000`);
  });
});