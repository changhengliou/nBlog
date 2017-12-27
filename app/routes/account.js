import express from 'express';
import jwt from 'jsonwebtoken';
import Config from '../config/config';

const router = express.Router();

router.get('/', (req, res) => res.send(req.url));
router.get('/signup', (req, res) => res.send(req.url));
router.post('/signin', (req, res) => {
    var { userId, userPwd } = req.body;
    if (userId !== 'admin' && userPwd !== '1234') {
        res.status(403).send(`request id = ${userId}, password = ${userPwd}`); 
        return;
    }

    jwt.sign({userName: 'admin'}, Config.SERVER_SECRET, { expiresIn: Config.EXPIRE } ,(err, token) => {
        if (err) {
            console.log(err);
            res.send(500).send('Something goes wrong.');
            return;
        }
        res.json({userName: 'admin', token: token});
    });
});

export default (app) => app.use('/api/v1/account', router);

