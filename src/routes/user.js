import express from 'express';
import { validationResult } from 'express-validator/check';
import User from './../models/User';
import parseErrors from '../utils/parseErrors';
import { validateEmail, validatePassword } from '../utils/validate';
import Poll from './../models/Poll';
import authenticate from '../middlewares/authenticate';

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
      res.json({ user: userRecord.toAuthJSON() });
    })
    .catch((err) => {
      const message = Object.values(parseErrors(err.errors))[0];
      if (message) {
        return res.status(400).json({ error: { message } });
      }
      return res.status(503).json({ error: { message: 'There has been an error with saving data to the database' } });
    });
});

router.get('/polls', authenticate, (req, res) => {
  Poll.find({ userId: req.currentUser._id })
    .then(polls => res.json({ polls }))
    .catch(err => res.json({ error: "You don't have any polls my friend!" }));
});

export default router;
