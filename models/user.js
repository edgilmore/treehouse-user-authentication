const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    favoriteBook: {
        type: String,
        required: false,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// authenticate input against database objects
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email })
      .exec((error, user) => {
          if (error) {
              return callback(error);
          } else if (!user) {
              const err = new Error('User not found.');
              err.status = 401;
              return callback(err);
          }
          bcrypt.compare(password, user.password, (error, result) => {
              if (result === true) {
                  return callback(null, user);
              }
              return callback();
          });
          return callback();
      });
};

// hash the password before storing the record
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        return next();
    });
});

module.exports = mongoose.model('User', UserSchema);
