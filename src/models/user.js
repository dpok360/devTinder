const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Inavlid email address: ' + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword) {
          throw new Error('Your password not strong');
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender data is not valid');
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        'https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Inavlid photo url: ' + value);
        }
      },
    },
    about: {
      type: String,
      default: 'THis is a default user',
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// const User = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);
