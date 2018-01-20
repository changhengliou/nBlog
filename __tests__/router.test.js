import request from 'supertest';
import { init, app } from '../app/config/init';
import express from 'express';

describe('router', () => {
    it ('/api/v1/post/', (done) => {
        request(app).get('/api/v1/post/')
                    .expect(res => {
                        console.log(JSON.stringify(res));
                    })
                    .expect(200, {})
                    .end(done);
    });
});