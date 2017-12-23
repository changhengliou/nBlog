import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.send(req.url));
router.get('/signup', (req, res) => res.send(req.url));
router.get('/signin', (req, res) => res.send(req.url));

export default (app) => app.use('/api/v1/account', router);

