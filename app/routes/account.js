import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Config from '../config/config';
import { gethash, isEmpty, isEmailValid } from '../utils/util';
import { User } from '../models/accountModel';

const router = express.Router();

router.all('*', (req, res, next) => {
    switch(req.path) {
        case '/api/v1/account/exist':
            // check if auth success?
            next();
            break;
        default:
            next();
    }
});

/**
 * user signin
 * @param {string} userId @required
 * @param {string} userPwd @required
 * @returns {403_forbidden} when login info is incorrect
 * @returns {500_server_error} when jwt failed to sign
 * @returns {userName: string, token: string}
 */
router.post('/signin', (req, res) => {
    var { userId, userPwd } = req.body,
        _pwd = gethash(userPwd);

    if (isEmpty(userId) || isEmpty(userPwd)) {
        res.status(400).json({ msg: 'Invalid form' });
        return;
    }

    User.findOne({ $or: [ { 
            name: userId.toUpperCase(), 
            passwordHash: _pwd 
        }, { 
            email: userId.toUpperCase(),
            passwordHash: _pwd
        } ]}, 'name email', (err, obj) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: `Failed to query database, ${err}` }); 
                return;
            }
            if (!obj) {
                res.status(403).json({ msg: `Please make sure you submit the correct information.` });
                return;
            }

            jwt.sign({
                    _id: obj._id,
                    name: obj.name,
                    email: obj.email
                }, Config.SERVER_SECRET, { expiresIn: Config.EXPIRE } ,(err, token) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: 'Something goes wrong.' });
                    return;
                }
                res.json({ _id: obj._id, userName: obj.name, emailAddr: obj.email, token: token });
            });
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

    var user = new User({
        name: userName,
        passwordHash: userPwd,
        email: emailAddr,
        lastActiveTime: new Date()
    });

    user.save()
        .then(obj => {
            jwt.sign({
                _id: obj._id,
                name: obj.name,
                email: obj.email
            }, Config.SERVER_SECRET, { expiresIn: Config.EXPIRE } ,(err, token) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: 'Something goes wrong.' });
                    return;
                }
                res.json({ userName: obj.name, token: token });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ msg: `Failed to save data, ${err}` });
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
    var { em, id } = req.query;
    User.findOne({ $or: [{ 'name': em }, { 'email': id }] }, 'email')
        .then(result => {
            if (result != null) {
                res.json({ existed: false, res: result });
            } else {
                res.send({ existed: true });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ existed: true });
        });
});

/**
 * delete a user
 */
router.delete('/delete/:userId', (req, res) => {
    var { userId } = req.param;
    if (isEmpty(userId)) {
        res.json({ msg: 'Failed' });
        return;
    }
    var result = User.findOneAndRemove({ _id: userId });
    if (result)
        res.json({ msg: 'Success' });
    else
        res.json({ msg: 'Failed' });
});

/**
 * update user info
 */
router.put('/update/user/:userId', (req, res) => {
});


export default (app) => app.use('/api/v1/account', router);

