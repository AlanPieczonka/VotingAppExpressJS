import express from 'express';
import { validationResult } from 'express-validator/check';
import User from './../models/User';
import { validateEmail, validatePassword } from '../utils/validate';
import Poll from './../models/Poll';
import authenticate from '../middlewares/authenticate';
import handleDbError from '../utils/handleDbError';

const router = express.Router();

router.post('/', [
  validateEmail('user.email'),
  validatePassword('user.password'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { email, password } = req.body.user;
  const user = new User({ email });
  user.setPassword(password);
  user
    .save()
    .then((userRecord) => {
      return res.json({ user: userRecord.toAuthJSON() });
    })
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

router.get('/polls', authenticate, (req, res) => {
  Poll.find({ userId: req.currentUser._id })
    .then((polls) => {
      if (polls.length === 0) {
        return res.status(401).json({ error: { message: "Currently you don't have any polls" } });
      }
      return res.json({ polls });
    })
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

export default router;
