const express = require("express");
const mongoose = require("mongoose");

const postRouter =  require("./routes/postRoutes")
const userRouter = require("./routes/authRoutes")

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




const mongo_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const connectWithRetry = async () => {
  mongoose
    .connect(mongo_URL)
    .then(() => console.log("Successfuly connected to mongo docker."))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

//pass these middleware so that our web app can access req.body in controllers
app.use(express.json())

app.use('/api/v1/posts', postRouter)
app.use("/api/v1/users", userRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectWithRetry();
  console.log(`Listening on port ${PORT}`);
});
