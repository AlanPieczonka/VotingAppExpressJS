import express from 'express';
import Poll from './../models/Poll';
import authenticate from './../middlewares/authenticate';
import handleDbError from '../utils/handleDbError';

const router = express.Router();

router.post('/', authenticate, (req, res) => {
  Poll.create({ ...req.body.poll, userId: req.currentUser._id })
    .then(poll => res.json({ poll }))
    .catch(error => handleDbError(error, res));
});

router.get('/', (req, res) => {
  Poll.find()
    .then((polls) => {
      if (polls.length === 0) {
        return res.status(401).json({ error: { message: 'Currently there is no polls in our database' } });
      }
      return res.json({ polls });
    })
    .catch(error => handleDbError(error, res));
});

router.get('/:id', (req, res) => {
  Poll.find({ _id: req.params.id })
    .then(poll => res.json(poll))
    .catch(error => handleDbError(error, res));
});

router.post('/:id/option', authenticate, (req, res) => {
  Poll.findOne({ _id: req.params.id })
    .then((poll) => {
      poll.options.push(req.body.newOption);
      poll.save((error, savedPoll) => {
        if (error !== null) {
          return handleDbError(error, res);
        }
        return res.json({ poll: savedPoll });
      });
    });
});

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

router.delete('/:id', authenticate, (req, res) => {
  Poll.findOne({ _id: req.params.id })
    .then((poll) => {
      if (poll.userId.equals(req.currentUser._id)) {
        Poll.remove(poll)
          .then(() => res.json({ success: { message: 'Successfully removed' } }))
          .catch(error => handleDbError(error, res));
      } else {
        return res.json({ error: { message: `You cannot delete other users' polls, ${req.currentUser.email}` } });
      }
    })
    .catch(error => handleDbError(error, res));
});

export default router;
