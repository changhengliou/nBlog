import bodyParser from 'body-parser';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import redis from 'redis';
import spaRouterMiddleware from '../ClientApp/boot-server';
import Routes from '../routes/Routes.js';
import Config from './config';
import process from 'process';

const rootPath = path.join(__dirname, '../');

export const init = (app) => {
  const redisClient = redis.createClient({
    host: Config.REDIS_HOST,
    port: Config.REDIS_PORT,
  });

  mongoose.Promise = global.Promise; // a work around to make deprecation warning disappear
  mongoose.connect(Config.CONNECTION_STRING, {
    useMongoClient: true,
    autoIndex: true,
    poolSize: 10,
    promiseLibrary: global.Promise // this line seems not working
  });

  const db = mongoose.connection;
  db.on('connected', () => 
    console.log(`Connect to mongodb at ${Config.CONNECTION_STRING}`)
  );
  db.on('disconnected', function() {
    console.log('On mongodb disconnected');
  });
  db.on('error', () => {
    console.log(`On mongodb connected error`);
    throw new Error(`Unable to connect to database at ${Config.CONNECTION_STRING}.`);
  });

  redisClient.on('connect', () => {
    console.log(`Connect to redis server at port ${Config.REDIS_PORT}`);
  });
  redisClient.on('error', (err) => {
    console.log(`On redis connected error.`);
  });

  app.engine('handlebars', handlebars({
               defaultLayout: 'layout',
               extname: '.handlebars',
               layoutsDir: path.join(rootPath, 'views', 'layout'),
               partialsDir: path.join(rootPath, 'views', 'partial')
             }));
  app.set('views', path.join(rootPath, 'views'));
  app.set('view engine', 'handlebars');

  app.use(bodyParser.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cookieParser());
  app.use(express.static(path.join(rootPath, 'wwwroot')));

  // app.use(session({
  //   store: new RedisStore({client: redisClient}),
  //   secret: Config.SERVER_SECRET,
  //   cookie: {maxAge: 60000},
  //   resave: false,
  //   saveUninitialized: false
  // }));

  app.use((req, res, next) => {
    res.set('x-content-type-options', 'nosniff');
    res.set('x-xss-protection', '1; mode=block');
    res.set('x-frame-options', 'SAMEORIGIN');
    res.removeHeader('X-Powered-By');
    next();
  });

  // /api/v1/
  Object.keys(Routes).map((key) => {
    Routes[key](app);
  });

  // use single page application
  app.use(spaRouterMiddleware);

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {helpers: {statusCode: err.status, errorMsg: err}});
  });
  return app;
}

export const app = init(express());