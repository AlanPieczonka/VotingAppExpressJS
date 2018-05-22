import jwt from 'jsonwebtoken';
import User from '../models/User';

export default (req, res, next) => {
  const header = req.headers.authorization,
        postmanTesting = false;
  let token;
  if (postmanTesting) {
    token = header;
  } else {
    if (header) token = header.split(' ')[1];
  } 

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ errors: { global: 'Invalid token' } });
      } else {
        console.log(token);
        User.findOne({ email: decoded.email }).then((user) => {
          req.currentUser = user;
          next();
        });
      }
    });
  } else {
    res.status(401).json({ errors: { global: 'No token' } });
  }
};
