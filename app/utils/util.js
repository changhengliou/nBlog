import crypto from 'crypto';
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