const express = require("express");
const mongoose = require("mongoose");
// import redis and express sessions
const session = require("express-session");
// const redis = require("redis");
const redis = require("ioredis");
// create a redis store
let RedisStore = require("connect-redis")(session);
const app = express();

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

// redis client definition
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
  // legacyMode: true
});

// redisClient.connect()
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
app.enable("trust proxy")
app.use(
  session({
    name: "qid",
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectWithRetry();
  console.log(`Listening on port ${PORT}`);
});
