const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const ConnectDB = require("./config/db");
const path = require("path");

//config
dotenv.config();

//mongoose conncetion
ConnectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//test routes
app.use("/api/v1/test", require("./routes/testRoute"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/invetoryRoutes"));
app.use("/api/v1/analytics", require("./routes/AnalyticsRoutes"));
app.use("/api/v1/admin", require("./routes/AdminRoutes"));

// STATIC FOLDER
app.use(express.static(path.join(__dirname, "./client/build")));

// STATIC Routes
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//PORT
const port = process.env.PORT || 8080;

//Port connection
app.listen(port, () => {
  console.log(
    `Server is running ${process.env.DEV_MODE} mode on port : ${port}`.bgCyan
      .black
  );
});
