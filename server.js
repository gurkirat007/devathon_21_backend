const express = require("express");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://parthiv:parthiv@joe-mama.wnc5e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const store = new MongoDBSession({
    uri : mongoURI,
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
app.get("/dashboard", isAuth, controller.getAllUsers);
app.post("/login", controller.loginUser);
app.post("/register", controller.createUser);
app.post("/update", isAuth, );

mongoose
  .connect(mongoURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
  })
  .then((res) => {
    console.log("Connected !");
    app.listen(8000, () => {
      console.log(`Server started on port`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

