import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatarURL: { type: String },
});

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
    },
    process.env.JWT_SECRET,
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    id: this._id,
    token: this.generateJWT(),
  };
};

schema.plugin(uniqueValidator, { message: 'This email is already taken' });

export default mongoose.model('User', schema);
