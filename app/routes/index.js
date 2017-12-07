import express from 'express';

const router = express.Router();

router.get(['/', '/index'], (req, res, next) => {
    res.render('index', { helpers: {
        people: 'changheng'
    } });
});

router.get('/index/abc', (req, res, next) => {
    res.render('index', { helpers: {
        people: 'abc'
    } });
});

export default (app) => app.use('/', router);
