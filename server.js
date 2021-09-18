const express = require("express");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
require('dotenv').config();
const mongoConnect = require('./util/database').mongoConnect;

const store = new MongoDBSession({
    uri : process.env.MONGO_URI,
    collection : 'mySessions'
});
const app = express();

app.use(express.urlencoded ({extended : false}));

app.use(
    session({
        secret : "secret",
        resave : false,
        store : store 
    })
);

const isAuth = require('./middleware/is-auth');
const controller = require('./controllers/controller');

app.get("/", controller.getAllUsers);
app.get("/dashboard", isAuth, controller.getUserDashboard);
app.post("/login", controller.loginUser);
app.post("/register", controller.requestForUserCreation);
app.post('/validate', controller.createUser);

mongoConnect(() => {
  app.listen(8000, () => {
    console.log(`Server started on 8000`);
  });
});