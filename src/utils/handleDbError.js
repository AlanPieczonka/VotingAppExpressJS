import parseErrors from '../utils/parseErrors';

export default (err, res) => {
  const message = Object.values(parseErrors(err.errors))[0];
  if (message) {
    return res.status(400).json({ error: { message } });
  }
  return res.status(503).json({ error: { message: 'There has been an error with the database' } });
};
