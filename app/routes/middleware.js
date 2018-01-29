import { isEmpty } from '../utils/util';
import { internalServerError, unauthorizeResult } from '../utils/common';
import jwt from 'jsonwebtoken';
import Config from '../config/config';

export const identityMiddleWare = (req, res, next) => {
    var token = (req.body._t || req.query._t) || req.params._t,
        data = {
            _id: null,
            name: null,
            email: null
        };
    if (isEmpty(token)) {
        next();
        return;
    }
    
    jwt.verify(token, Config.SERVER_SECRET, (err, token) => {
        if (err) {
            res.locals.auth = { ...data, error: err };
            next();
            return;
        }
        res.locals.auth = {
            _id: token._id,
            name: token.name,
            email: token.email
        };
        next();
    });
};

export const authenticationMiddleware = (req, res, next) => {
    console.log(res.locals);
    if (!res.locals.auth || res.locals.auth.error) {
        var error = res.locals.auth ? res.locals.auth.error : null;
        unauthorizeResult(res, error);
        return;
    }
    next();
}