const express = require("express");
const mongoose = require("mongoose");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");
const app = express();

app.get("/", async (req, res, next) => {
  return res.send("<h2>Hello Header Updated and updated</h2>");
});

console.log(`User is ${MONGO_USER}`);
console.log(`Password is ${MONGO_PASSWORD}`);

const connectWithRetry = async () => {
  mongoose
    .connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    )
    .then(() => console.log("Successfuly connected to mongo docker."))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectWithRetry();
  console.log(`Listening on port ${PORT}`);
});
