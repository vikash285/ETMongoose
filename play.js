const path = require("path");
const fs = require("fs");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const userRoutes = require("./routes/user");
const expensesRoutes = require("./routes/expenses");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const resetPasswordRoutes = require("./routes/resetPassword");

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "Public")));

app.use("/user", userRoutes);
app.use("/expense", expensesRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);
app.use("/password", resetPasswordRoutes);

app.use((req, res) => {
  console.log("url", req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

mongoose
  .connect(
    "mongodb+srv://vikash:1702moM@cluster0.cgd1s9x.mongodb.net/expense?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
    console.log("Connected!");
  })
  .catch((err) => console.log(err));
