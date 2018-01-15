import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Config from '../config/config';

export const gethash = (str) => {
    return crypto.createHmac('sha256', Config.SERVER_SECRET).update(str).digest('hex');
}

// check if string is empty
export const isEmpty = str => !str || /^\s*$/.test(str);

// check if email is valid
export const isEmailValid = str => /^[\w.%+-]+@[\w.]{2,}\.[\w]{2,}$/.test(str);

// check if is int
export const isInt = str => /^(?:[-+]?(?:0|[1-9][0-9]*))$/.test(str);

export const getDateString = (date) => {
    if (!date)
        date = new Date();
    else if (typeof date === 'string')
        date = new Date(date);

    var mm = date.getMonth() + 1, 
        dd = date.getDate();

    return [ date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd ].join('-');
}

export const getTimeString = (time) => {
    if (!time)
        time = new Date();
    else if (typeof date === 'string')
        time = new Date(time);

    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    return [(h > 9 ? '' : '0') + h, (m > 9 ? '' : '0') + m, (s > 9 ? '' : '0') + s].join(':');
}

export const getDateTimeString = (dt) => getDateString(dt) + " " + getTimeString(dt);

export const getDateDiffByDay = (date1, date2) => {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = timeDiff / (1000 * 3600 * 24); 
    return diffDays;
} 

export const authCheckMiddleWare = (req, res, next) => {
    var token = req.body._t || req.query._t;
    if (isEmpty(token)) {
        res.status(403).json({ msg: 'Unauthorized access.' });
        return;
    }
    jwt.verify(token, Config.SERVER_SECRET, (err, token) => {
        if (err) {
            res.status(500).json({ msg: 'Something goes wrong' });
            return;
        }
        next();
    });
}