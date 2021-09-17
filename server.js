const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);
const app = express();

mongoURI = "mongodb+srv://gurkirat007:devathon007@sardaarji007.3iyaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
    .connect(mongoURI, err => {
        if (err) throw err;
        console.log("connected to mongo");
    })


const store = new MongoDBSession({
    uri: mongoURI,
    collection: "mySessions",
});

app.use(
    session({
        secret: "key that will assign cookie",
        resave: false,
        saveUninitialized: false,
        store: store
    })
)

app.get("/", (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    res.send("Hello Sessions Tut");
});

app.listen(5000, console.log("server at https://localhost:5000"));