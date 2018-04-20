import { Router } from 'express';
import path from 'path';

import auth from './routes/auth';
import users from './routes/users';

const routes = Router();

routes.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

routes.use('/auth', auth);
routes.use('/users', users);

export default routes;
