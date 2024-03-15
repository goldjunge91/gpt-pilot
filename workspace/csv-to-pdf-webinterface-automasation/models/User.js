const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid'); // Added for generating unique user ID
require("dotenv").config();
const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
    default: uuid.v4,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Hash the password before saving a new user
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Compare the provided password with the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models?.User || mongoose.model("User", userSchema);

module.exports = User;
const MONGODB_URI = (process.env.DATABASE_URL);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));