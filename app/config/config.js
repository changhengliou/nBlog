import express from 'express';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import Routes from '../routes/Routes.js';
import spaRouterMiddleware from '../ClientApp/boot-server';

const rootPath = path.join(__dirname, '../');

export const connectionString = 'mongodb://mongodb/nblog';

export const config = (app) => {
    app.engine('handlebars', handlebars({
        defaultLayout: 'layout',
        extname: '.handlebars',
        layoutsDir: path.join(rootPath, 'views', 'layout'),
        partialsDir: path.join(rootPath, 'views', 'partial')
    }));
    app.set('views', path.join(rootPath, 'views'));
    app.set('view engine', 'handlebars');

    app.use(bodyParser.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(rootPath, 'wwwroot')));

    app.use((req, res, next) => {
        res.set('x-content-type-options', 'nosniff'); 
        res.set('x-xss-protection', '1; mode=block');
        res.set('x-frame-options', 'SAMEORIGIN');
        res.removeHeader('X-Powered-By');
        next();
    });

    app.use(spaRouterMiddleware);

    
    // Object.keys(Routes).map((key) => {
    //     Routes[key](app);
    // });

    // app.use((req, res, next) => {
    //     var err = new Error('Not Found');
    //     err.status = 404;
    //     next(err);
    // });

    // app.use((err, req, res, next) => {
    //     res.status(err.status || 500);
    //     res.render('error', {
    //         helpers: {
    //             statusCode: err.status,
    //             errorMsg: err
    //         }
    //     });
    // });
}