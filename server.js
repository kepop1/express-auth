const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
