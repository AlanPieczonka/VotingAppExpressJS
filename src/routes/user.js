import express from 'express';
import Poll from './../models/Poll';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

// GET specific current user's polls * ONLY AUTHENTICATED USER *
router.get('/polls', authenticate, (req, res) => {
  Poll.find({ userId: req.currentUser._id })
    .then(polls => res.json({ polls }))
    .catch(err => res.json({ error: "You don't have any polls my friend!" }));
});

export default router;
