import request from 'supertest';
import { init, app } from '../app/config/init';
import express from 'express';

describe('Router Accounts', () => {
    const _uid = 'test',
          _email = 'test@nblog.cc',
          _pwd = 'testpassword';

    it ('POST SIGNUP: /api/v1/account/', (done) => {
        request(app).post('/api/v1/account/signup')
                    .send({ 
                        userName: _uid,
                        emailAddr: _email,
                        userPwd: _pwd,
                        userPwd2: _pwd
                    })
                    .expect(res => {
                        var { userName, token } = res.body;
                        expect(userName).toBe(_uid.toUpperCase());
                        expect(token).toBeDefined();
                    })
                    .expect(200)
                    .end(done);
    });

    it ('POST SIGNIN BY ID: /api/v1/account/', (done) => {
        request(app).post('/api/v1/account/signin')
                    .send({ 
                        userId: _uid,
                        userPwd: _pwd,
                    })
                    .expect(res => {
                        var { _id, userName, emailAddr, token } = res.body;
                        expect(userName).toBe(_uid.toUpperCase());
                        expect(emailAddr).toBe(_email.toUpperCase());
                        expect(token).toBeDefined();
                    })
                    .expect(200)
                    .end(done);
    });

    it ('GET EXIST: /api/v1/account/', (done) => {
        request(app).get('/api/v1/account/exist')
                    .send({ 
                        em: _email,
                        id: _uid,
                    })
                    .expect(res => {
                        var { existed } = res.body;
                        expect(existed).toBeTruthy();
                    })
                    .expect(200)
                    .end(done);
    });

    it ('DELETE USER: /api/v1/account/', (done) => {
        request(app).post('/api/v1/account/signin')
        .send({ 
            userId: _uid,
            userPwd: _pwd,
        })
        .then(res => {
            var { _id, userName, emailAddr, token } = res.body;
            expect(userName).toBe(_uid.toUpperCase());
            expect(emailAddr).toBe(_email.toUpperCase());
            expect(token).toBeDefined();
            request(app).delete(`/api/v1/account/delete/${_id}`)
                        .expect(res => {
                            var { msg } = res.body;
                            expect(msg).toBe('Success');
                        })
                        .expect(200)
                        .end(done);
        })
    });
});

describe('Router Posts', () => {
    it ('GET POSTS: /api/v1/post/', (done) => {
        request(app).get('/api/v1/post/')
                    .expect(res => {
                        expect(res.body.data[0].title).toEqual('title 123');
                    })
                    .expect(200)
                    .end(done);
    });
});

    // expect(n).toBeNull();
    // expect(n).toBeDefined();
    // expect(n).not.toBeUndefined();
    // expect(n).not.toBeTruthy();
    // expect(n).toBeFalsy();

    // expect(value).toBeGreaterThan(3);
    // expect(value).toBeGreaterThanOrEqual(3.5);
    // expect(value).toBeLessThan(5);
    // expect(value).toBeLessThanOrEqual(4.5);

    // expect(value).toBe(4);
    // expect(value).toEqual(4);
    // expect(value).toBeCloseTo(0.3);
    // expect('Christoph').toMatch(/stop/);

    // expect(shoppingList).toContain('beer');

    // expect(compileAndroidCode).toThrow();