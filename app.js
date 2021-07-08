require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const port = process.env.PORT || 3001;

//API Security
app.use(helmet());

//Handle CORS error
app.use(cors());

//MongoDB Connection Setup
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/crm_ticket_system", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});


if (process.env.NODE_ENV !== "production") {
    const mDb = mongoose.connection;
    mDb.on("open", () => {
        console.log("MongoDB is connected")
    })
    
    mDb.on("error", (error) => {
        console.log(error)
    })
    
    //Logger
    app.use(morgan("tiny"));
}

//Set body bodyParser
app.use(express.urlencoded({extended: true}));
app.use(express.json())

//Load routers
const userRouter = require("./src/router/user.router");
const ticketRouter = require("./src/router/ticket.router");

//Use routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

//Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
    const error = new Error("Resources not found.");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    handleError(error, res);
})

app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`)
});