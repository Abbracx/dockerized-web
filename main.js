const express = require("express");
const mongoose = require("mongoose");
// import redis and express sessions
const session = require("express-session");
const redis = require("redis");

// create a redis store
let RedisStore = require("connect-redis")(session);

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/authRoutes");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");
const app = express();

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
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
app.use(express.json());

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: true,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectWithRetry();
  console.log(`Listening on port ${PORT}`);
});
