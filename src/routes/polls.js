import express from 'express';
import User from './../models/User';
import Poll from './../models/Poll';
import authenticate from './../middlewares/authenticate';

const router = express.Router();

// TODO: Think about using async/await here
// POST new poll * ONLY AUTHENTICATED USER *
router.post('/', authenticate, (req, res) => {
  console.log(req.body.poll);
  Poll.create({ ...req.body.poll, userId: req.currentUser._id })
    .then(poll => res.json({ poll }))
    .catch(err => res.status(401).json({ error: err.errmsg }));
});

// GET all polls *ANY USER*
router.get('/', (req, res) => {
  Poll.find()
    .then(polls => res.json({ polls }))
    .catch(() => res.json({ errors: 'Cannot find any poll!!!' }));
});

// GET specific poll *ANY USER*
router.get('/:id', async (req, res) => {
  Poll.find({ _id: req.params.id }).then(poll => res.json(poll));
});

router.put('/:id', authenticate, async (req, res) => {
  Poll.find({ _id: req.params.id }).then((poll) => {
    console.log(poll);
  })
});

// PUT increment number of votes on specific option
router.put('/:id/:option_id/up', (req, res) => {
  Poll.findById({ _id: req.params.id }).then((poll) => {
    poll.options.forEach((option) => {
      if (option._id.equals(req.params.option_id)) {
        option.votes += 1;
        option.save((err, updatedObject) => {
          if (err) console.log('There has been an error with incrementing option');
        });
      }
    });
    poll.save();
    res.json({ poll });
  })
    .catch(error => res.json({ message: 'Cannot find this poll' }));
});

// PUT decrement number of votes on specific option
router.put('/:id/:option_id/down', (req, res) => {
  Poll.findById({ _id: req.params.id }).then((poll) => {
    poll.options.forEach((option) => {
      if (option._id.equals(req.params.option_id)) {
        option.votes -= 1;
        option.save((err, updatedObject) => {
          if (err) console.log('There has been an error with decrementing option');
        });
      }
    });
    poll.save();
    res.json({ poll });
  })
    .catch(error => res.json({ message: 'Cannot find this poll' }));
})

// DELETE poll *ONLY AUTHENTICATED AND AUTHORIZED USER*
router.delete('/:id', authenticate, async (req, res) => {
  Poll.findOne({ _id: req.params.id }).then((poll) => {
    if (poll.userId.equals(req.currentUser._id)) {
      Poll.remove(poll)
        .then(() => res.json({ message: 'Successfully removed' }))
        .catch(error => res.json({ errors: 'There was a problem with removing polls' }));
    } else {
      return res.json({ errors: `You are not the author of this poll, ${req.currentUser.email}!!!` });
    }
  });
});

export default router;
