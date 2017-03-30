const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Schema for user storage in MongoDB
var userSchema = mongoose.Schema({
  local: {
    fname: String,
    lname: String,
    username: String,
    email: String,
    password: String,
    age: Number,
    gender: String
  },
  // facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // },
  // twitter: {
  //   id: String,
  //   token: String,
  //   displayName: String,
  //   username: String
  // },
  // google: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // }
});

// Hashes password for user creation
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Hashes password and compares it to user password to validate
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Generates the 'User' model for use to find users
module.exports = mongoose.model('User', userSchema);
