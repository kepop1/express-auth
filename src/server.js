const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/user");
const authenticateUser = require("./utils/authenticateUser");

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGODB_URI || "mongodb://localhost/auth";

const mongooseOptions = {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
};

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Use our authentication routes
app.use(routes);

// User our authenticate middleware before allowing any other routes to be run through
app.use(authenticateUser);

//Technically a route that will not be reached if you're not authenticated
app.get("/route", (req, res) => {
  res.status(200).json({
    success: true,
    message: "You're authenticated well done!",
    data: { info: "hello world" },
  });
});

mongoose.connect(DB_URI, mongooseOptions);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
