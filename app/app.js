import express from 'express';
import { init } from './config/init';
import Config from './config/config';

const app = express();

init(app);

app.listen(Config.LISTEN_PORT, () => {
    console.log(`listen on port ${Config.LISTEN_PORT}.`)
});