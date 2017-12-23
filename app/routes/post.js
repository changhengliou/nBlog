import express from 'express';

const router = express.Router();

router.get(['/', '/index'], (req, res, next) => {
    res.send(`${req.originalUrl}`);
});

router.get('/:postId/edit', (req, res, next) => {
    res.send(`${req.originalUrl}`);
});

router.get('/:postId/remove', (req, res, next) => {
    res.send(`${req.originalUrl}`);
});

router.get('/:postId/comment', (req, res, next) => {
    res.send(`${req.originalUrl}`);
});

router.get('/:postId/comment/:commentId/remove', (req, res, next) => {
    var params = '';
    Object.keys(req.params).map((obj) => {
        params += `key = ${obj}, value = ${req.params[obj]}\n`;
    });
    var queries = '';
    Object.keys(req.query).map((obj) => {
        params += `key = ${obj}, value = ${req.query[obj]}\n`;
    });
    res.send(`${req.originalUrl} ${params} ${queries}`);
});

export default (app) => app.use('/api/v1/post', router);
