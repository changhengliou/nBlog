import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.send('/account'));
router.get('/abc', (req, res) => res.send('/account/abc'));

export default (app) => app.use('/account', router);

