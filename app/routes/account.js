import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Config from '../config/config';
import { isEmpty, isEmailValid } from '../utils/util';
import { User } from '../models/accountModel';

const router = express.Router();

router.get('/', (req, res) => res.send(req.url));

/**
 * user signin
 * @param {string} userId @required
 * @param {string} userPwd @required
 * @returns {403_forbidden} when login info is incorrect
 * @returns {500_server_error} when jwt failed to sign
 * @returns {userName: string, token: string}
 */
router.post('/signin', (req, res) => {
    var { userId, userPwd } = req.body;
    if (userId !== 'admin' && userPwd !== '1234') {
        res.status(403).send(`request id = ${userId}, password = ${userPwd}`); 
        return;
    }

    jwt.sign({userName: 'admin'}, Config.SERVER_SECRET, { expiresIn: Config.EXPIRE } ,(err, token) => {
        if (err) {
            console.log(err);
            res.status(500).send('Something goes wrong.');
            return;
        }
        res.json({userName: 'admin', token: token});
    });
});

/**
 * for creating a new account
 * @param {string} userName @required
 * @param {string} emailAddr @required email address
 * @param {string} userPwd @required password
 * @param {string} userPwd2 @required re-enter password 
 * @returns {400_bad_request} when form is invalid
 * @returns {500_server_error} when jwt failed to sign
 * @returns {userName: string, token: string}
 */
router.post('/signup', (req, res) => {
    var { userName, emailAddr, userPwd, userPwd2 } = req.body;
    if (isEmpty(userName) || isEmpty(emailAddr) || isEmpty(userPwd) || 
        isEmpty(userPwd2) || !isEmailValid(emailAddr) || (userPwd !== userPwd2)) {
        res.status(400).json({ msg: 'Invalid form' });
        return;
    }

    jwt.sign({userName: 'admin'}, Config.SERVER_SECRET, { expiresIn: Config.EXPIRE } ,(err, token) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something goes wrong.' });
            return;
        }
        res.json({ userName: 'admin', token: token });
    });
});

/**
 * given email or id and check if exist
 * @param {string} em email
 * @param {string} id id
 * @returns {400_bad_request} when query is fail to executed.
 * @returns {existed: bool} is existed
 */
router.get('/exist', (req, res) => {
    var { em, id } = req.params;
    User.findOne({ $or: [{ 'name': em }, { 'email': id }] }, 'email')
        .then(result => {
            console.log(result);
            res.json({ existed: false, res: result });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ existed: true });
        });
});


export default (app) => app.use('/api/v1/account', router);

