const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const authrouter = require("./routes/authrouter");
const userdetails = require("./routes/userdetails");
const finverserouter = require("./routes/finverseRouter");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);

// Detect environment
const ENV = process.env.ENVIRONMENT || "development";

// Support both Expo run and downloaded APK access
const FRONTEND_ORIGIN = [
  "http://localhost:8081", // Expo local dev
  "http://10.0.2.2:8081", // Android emulator
  "exp://10.0.2.2:8081", // Optional for Expo Go access
];

const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: ENV === "production" ? "true" : "auto",
      httpOnly: true,
      sameSite: ENV === "production" ? "none" : "lax",
    },
  })
);

app.use("/auth", authrouter);
app.use("/user",userdetails)
app.use("/finverse", finverserouter);


// Testing
app.get("/", (req, res) => {
  res.json("hi");
});

// Testing
app.get("/asd", (req, res) => {
  res.json("hi");
});


io.on("connect", (socket) => {});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
