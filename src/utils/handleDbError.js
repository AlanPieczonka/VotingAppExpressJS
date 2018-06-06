import parseErrors from '../utils/parseErrors';

export default (err) => {
  const message = Object.values(parseErrors(err.errors))[0] || err.message;
  if (message) {
    return {
      message,
      statusCode: 404,
    };
  }
  return {
    message: 'There has been an error with the database',
    statusCode: 503,
  };
};
