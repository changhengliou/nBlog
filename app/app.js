import {
    init,
    app
} from './config/init';
import Config from './config/config';

app.then(res => res.listen(Config.LISTEN_PORT, Config.HOST_NAME, () => {
    console.log(`listen on port ${Config.LISTEN_PORT}.`);
}));
