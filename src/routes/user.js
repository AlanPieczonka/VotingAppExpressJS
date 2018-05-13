import express from 'express';
import Poll from './../models/Poll';
import authenticate from '../middlewares/authenticate';

const router = express.Router();
router.use(authenticate);

// GET current user's profile properties * ONLY AUTHENTICATED USER *
router.get('/', (req, res) =>
  res.json({
    user: {
      email: req.currentUser.email,
    },
  }));

// GET specific current user's polls * ONLY AUTHENTICATED USER *
router.get('/polls', (req, res) => {
  Poll.find({ userId: req.currentUser._id })
    .then(polls => res.json({ polls }))
    .catch(err => res.json({ error: "You don't have any polls my friend!" }));
});

export default router;
