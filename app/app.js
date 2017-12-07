import express from 'express';
import {
    config,
    connectionString
} from './config/config';
import mongoose from 'mongoose';


mongoose.connect(connectionString, {
    useMongoClient: true
});
const db = mongoose.connection;
db.on('error', () => {
    // throw new Error(`unable to connect to database at ${connectionString}`);
});

const app = express();

config(app);

app.listen(5000, () => {
    console.log('listen on port 5000.')
});