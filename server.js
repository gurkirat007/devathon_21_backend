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

app.use(
    session({
        secret : "secret",
        resave : false,
        saveUninitialized : false,
        store : store 
    })
);

app.get("/", );
app.get("/dashboard", );
app.post("/login", );
app.post("/register", );
app.post("/update", );

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
