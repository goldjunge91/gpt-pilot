// <!--''' -----------------------format----------------------------javascript -->'''
//  Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const axios = require('axios'); // Add this line
const authRoutes = require("./routes/authRoutes");
const cors = require('cors');

// Add the following code to ensure the .env is loaded before the app starts
if (process.env.NODE_ENV !== 'production') {
  console.log('Loading .env file');
  require('dotenv').config();
}
if (!process.env.DATABASE_URL) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file DATABASE_URL.");
  process.exit(-1);
}

if (!process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file. SESSION_SECRET ");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session storage
const advancedOptions = { useUnifiedTopology: true };
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    mongoOptions: advancedOptions,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
}));

// Add the following line for session middleware
// app.use((req, res, next) => {
//   console.log('SESSION MIDDLEWARE zeile 64 app.');
//   next();
// });
app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = null;
  }
  next();
});


// Ping route
let message = "pong";
app.get("/ping", async (req, res) => {
  try {
    console.log(("PING ROUTE", message));
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    console.log(response.data);
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    console.error("Error getting data from ping route:", error);
    res.status(500).json({ message: "Error getting data from ping route" });
  }
});

app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// ```
// ------------------------end\_of\_format---------------------------