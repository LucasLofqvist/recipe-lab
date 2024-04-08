const mg = require("mongoose");
require("dotenv").config();

const uri = process.env.URI;

function connect() {
    return mg.connect(uri)
    .then(() => {console.log("Connected to database!")})
    .catch(err => {console.error("Could not connect to database" + err)});
}

module.exports = connect;