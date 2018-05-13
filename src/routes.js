import { Router } from 'express';
import path from 'path';

import auth from './routes/auth';
import join from './routes/join';
import user from './routes/user';
import polls from './routes/polls';

const routes = Router();

routes.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

routes.use('/auth', auth);
routes.use('/join', join);
routes.use('/user', user);
routes.use('/polls', polls);

export default routes;
