const express = require("express");
const router = require("./routers/apiRouter");
const path = require("path");
const connect = require("./connection");

require("dotenv").config();
const port = process.env.PORT || 5000;

//Creating instance of an express application
const app = express();

//Mounting router on /api route
app.use("/api", router);

app.use(express.static(path.join(__dirname, "public")));

//Creating handler for default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

//Connect to database
connect();

app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});