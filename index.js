const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require('cors')
const bodyParser = require("body-parser")

// Routes:
const customerRoute = require("./routes/customer_routes");

dotenv.config()

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

app.use( cors() )
app.use( express.json() )

app.use("/api/customer", customerRoute);

const uri = `mongodb+srv://${process.env.USERNAME2}:${process.env.PASSWORD}@cluster0.celbe.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(
  uri,
).then(() => {
    console.log("Connected to database")
}).catch(err => {
    console.log("Error connecting to database", err)
});

app.listen(5000, () => {
  console.log("Server is up and running on 5000");
});
