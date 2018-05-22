import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import Promise from 'bluebird';
import routes from './routes';

dotenv.config();
const app = express();
app.disable('x-powered-by');
app.set('view engine', 'html');
app.use(cors());
app.use(logger('dev', {
  skip: () => app.get('env') === 'test',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mongo
mongoose.Promise = Promise; // override default mongoose's Promise with bluebird's promise
mongoose.connect(process.env.MONGODB_URL);

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(401).json({
    error: {
      message: err.message,
    },
  });
});

export default app;
