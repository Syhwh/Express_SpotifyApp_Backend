const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  userEmail: {
    type: String,
    required: [true, "is required"]
  },
  userPassword: {
    type: String,
    required: [true, "is required"]
  },
  date: {
    type: Date,
    default: Date.now()
  },
  image: [],
  profileComplete: false
});

// Encrypt the password
UserSchema.pre("save", function (next) {
  bcrypt.hash(this.userPassword, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.userPassword = hash;
    next();
  });
});

// verify that the user exists and the password is correct
UserSchema.statics.authenticate = async (email, password) => {
  const user = await mongoose.model('User').findOne({ userEmail: email });
  if (user) {
    console.log('user in login')
    console.log(user)
    console.log(user.userPassword)

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.userPassword, (err, result) => {
        if (err) reject(err);
        resolve(result === true ? user : null);
      });
    });
  } else {
    return null;
  }
}



module.exports = mongoose.model('User', UserSchema)
