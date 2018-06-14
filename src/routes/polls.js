import express from 'express';
import Poll from './../models/Poll';
import authenticate from './../middlewares/authenticate';
import handleDbError from '../utils/handleDbError';
import getIp from '../utils/getIp';

const router = express.Router();

router.post('/', authenticate, (req, res) => {
  Poll.create({ ...req.body.poll, userId: req.currentUser._id })
    .then(poll => res.json({ poll }))
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

router.get('/', (req, res) => {
  Poll.find()
    .then((polls) => {
      if (polls.length === 0) {
        return res.status(404).json({ error: { message: 'Currently there are no polls in our database' } });
      }
      return res.json({ polls });
    })
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

router.get('/:id', (req, res) => {
  Poll.find({ _id: req.params.id })
    .then(poll => res.json(poll))
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

router.post('/:id/option', authenticate, (req, res) => {
  Poll.findOne({ _id: req.params.id })
    .then((poll) => {
      poll.options.push(req.body.newOption);
      poll.save((error, savedPoll) => {
        if (error !== null) {
          const { message, statusCode } = handleDbError(error);
          return res.status(statusCode).json({ error: { message } });
        }
        return res.json({ poll: savedPoll });
      });
    })
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

router.patch('/:id/:option/up', (req, res) => {
  Poll.findOne({ _id: req.params.id })
    .then((poll) => {
      const ipAddress = getIp(req);

      let userAlreadyVoted = false;
      poll.options.forEach((option) => {
        const optionIncludesUser = option.votes.some(option => option.ipAddress === ipAddress);
        const isTheRightID = option._id.equals(req.params.option);

        if (isTheRightID && optionIncludesUser) {
          userAlreadyVoted = true;
        } else if (isTheRightID && !optionIncludesUser) {
          option.votes.push({
            ipAddress,
          });
          option.save();
        } else if (!isTheRightID && optionIncludesUser) { // clean code or security???
          const _id = option.votes.find(vote => vote.ipAddress === ipAddress);
          option.votes.pull({ _id });
          option.save();
        }
      });

      if (userAlreadyVoted) {
        return res.status(401).json({ error: { message: 'You have already voted on this option' } });
      }

      poll.save((error, savedPoll) => {
        if (error !== null) {
          const { message, statusCode } = handleDbError(error);
          return res.status(statusCode).json({ error: { message } });
        }
        return res.status(200).json({ poll: savedPoll });
      });
    })
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

router.delete('/:id', authenticate, (req, res) => {
  Poll.findOne({ _id: req.params.id })
    .then(({ _id, userId }) => {
      if (userId.equals(req.currentUser._id)) {
        Poll.remove({ _id })
          .then((err, poll) => res.json({ success: { message: 'Successfully removed' } }))
          .catch((error) => {
            const { message, statusCode } = handleDbError(error);
            return res.status(statusCode).json({ error: { message } });
          });
      } else {
        return res.json({ error: { message: `You cannot delete other users' polls, ${req.currentUser.email}` } });
      }
    })
    .catch((error) => {
      const { message, statusCode } = handleDbError(error);
      return res.status(statusCode).json({ error: { message } });
    });
});

export default router;
