import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  avatarURL: { type: String, min: 1, max: 120 },
});

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.isValidAvatarURL = function isValidAvatarURL(url) {
  const regexp = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png))/i;
  return regexp.test(url) || url === '';
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

export default mongoose.model('User', schema);
