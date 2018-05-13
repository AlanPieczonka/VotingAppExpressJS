import express from 'express';
import { validationResult } from 'express-validator/check';
import User from './../models/User';
import parseErrors from '../utils/parseErrors';
import { validateEmail, validatePassword } from '../utils/validate';

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
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
