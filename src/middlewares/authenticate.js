import jwt from 'jsonwebtoken';
import User from '../models/User';

export default (req, res, next) => {
  const header = req.headers.authorization;
  let token;
    if (header) token = header.split(' ')[1];
    // console.log(token);
  // token = header; // just for the POSTMAN testing
  console.log(token);
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
