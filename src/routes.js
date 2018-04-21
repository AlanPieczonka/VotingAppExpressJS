import { Router } from 'express';
import path from 'path';

import auth from './routes/auth';
import join from './routes/join';

const routes = Router();

routes.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

routes.use('/auth', auth);
routes.use('/join', join);

export default routes;
