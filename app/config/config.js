import process from 'process';

const config = {
  HOST_NAME: '0.0.0.0',
  LISTEN_PORT: 5000,
  CONNECTION_STRING: process.env.NODE_ENV === 'production' ? 
    'mongodb://root:jB1rz4FkhjnHKJXSXwfT@52.197.247.25:27017/admin' ://?authSource=admin?authMode=scram-sha1
    'mongodb://172.16.238.5:27017/nblog',
  REDIS_HOST: '172.16.238.4',
  REDIS_PORT: '6379',
  SERVER_SECRET: 'aMw?Wh16K6tYr$zBzFo3zq!&Qp&$ad',
  EXPIRE: 7200
}
export default config;