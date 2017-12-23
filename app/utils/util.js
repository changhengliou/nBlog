import crypto from 'crypto';
import Config from '../config/config';

export const gethash = (str) => {
    return crypto.createHmac('sha256', Config.SERVER_SECRET).update(str).digest('hex');
}
