import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import {
    User
} from '../app/models/accountModel';
import {
    Post
} from '../app/models/postModel';
import {
    EditorState,
    convertToRaw,
    convertFromHTML,
    ContentState,
    convertFromRaw
} from 'draft-js';


describe('Router Test', () => {
    const __blocks__ = convertFromHTML('<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
            '<a href="http://www.facebook.com">Example link</a>'),
        _uid = 'test',
        _email = 'test@nblog.cc',
        _pwd = 'testpassword',
        _title = 'test title',
        _excerpt = 'test excerpt',
        _editorState = EditorState.createWithContent(
            ContentState.createFromBlockArray(
                __blocks__.contentBlocks,
                __blocks__.entityMap
            )
        ),
        _remark = 'test message',
        removeAll = model => model.remove({}).lean().exec().then(res => console.log(res.result)).catch(err => console.log(err)),
        /**
         * @param {Func} fn - function with @param respond object
         */
        signIn = fn => request(app).post('/api/v1/account/signin').send({
            userId: _uid,
            userPwd: _pwd,
        }).then(fn),
        getPosts = fn => request(app).get('/api/v1/post/').then(fn),
        getPostIdAndSignIn = fn => {
            getPosts(res => {
                var { status, body } = res,
                    _data = body.data[0];
                expect(status).toEqual(200);
                expect(_data.title).toEqual(_title);
                expect(_data.excerpt).toEqual(_excerpt);
    
                signIn(res => {
                    var {
                        _id,
                        userName,
                        emailAddr,
                        token
                    } = res.body;
                    expect(res.status).toEqual(200);
                    expect(userName).toBe(_uid.toUpperCase());
                    expect(emailAddr).toBe(_email.toUpperCase());
                    expect(token).toBeDefined();
                    fn(token, _data._id, _data.comments);
                });
            });
        }
    var app;

    beforeAll(() => {
        delete require.cache[require.resolve('../app/config/init').app];
        app = require('../app/config/init').app;
        removeAll(User);
        removeAll(Post);
    });

    it('POST SIGNUP: /api/v1/account/', (done) => {
        request(app).post('/api/v1/account/signup')
            .send({
                userName: _uid,
                emailAddr: _email,
                userPwd: _pwd,
                userPwd2: _pwd
            })
            .expect(res => {
                var {
                    userName,
                    token
                } = res.body;
                expect(userName).toBe(_uid.toUpperCase());
                expect(token).toBeDefined();
            })
            .expect(200)
            .end(done);
    });

    it('POST SIGNIN BY ID: /api/v1/account/', (done) => {
        signIn(res => {
                var {
                    _id,
                    userName,
                    emailAddr,
                    token
                } = res.body;
                expect(res.status).toEqual(200);
                expect(userName).toBe(_uid.toUpperCase());
                expect(emailAddr).toBe(_email.toUpperCase());
                expect(token).toBeDefined();
                done();
            });
    });

    it('GET EXIST: /api/v1/account/', (done) => {
        request(app).get('/api/v1/account/exist')
            .send({
                em: _email,
                id: _uid,
            })
            .expect(res => {
                var {
                    existed
                } = res.body;
                expect(existed).toBeTruthy();
            })
            .expect(200)
            .end(done);
    });

    it('CREATE POSTS /api/v1/post/create/', (done) => {
        // create post without login, expect to get 403
        request(app).post('/api/v1/post/create')
            .then(res => {
                expect(res.status).toEqual(403);
                expect(res.body.msg).toBeDefined();
            });
        signIn(res => {
                var {
                    _id,
                    userName,
                    emailAddr,
                    token
                } = res.body;
                expect(res.status).toEqual(200);
                expect(userName).toBe(_uid.toUpperCase());
                expect(emailAddr).toBe(_email.toUpperCase());
                expect(token).toBeDefined();

                // create post
                request(app).post('/api/v1/post/create')
                    .send({
                        title: _title,
                        excerpt: _excerpt,
                        editorState: convertToRaw(_editorState.getCurrentContent()),
                        _t: token
                    })
                    .expect(res => {
                        expect(res.body.msg).toMatch(/Successfully/);
                    })
                    .expect(200).end(done);
            });
    });
    
    it('GET POSTS /api/v1/post/', (done) => {
        getPosts(res => {
                var { status, body } = res,
                    _data = body.data[0];
                expect(status).toEqual(200);
                expect(_data.title).toEqual(_title);
                expect(_data.excerpt).toEqual(_excerpt);
                done();
            });
    });

    it('GET POST BY ID /api/v1/post/postId/edit/', (done) => {
        getPosts(res => {
            var { status, body } = res,
                _data = body.data[0];
            expect(status).toEqual(200);
            expect(_data.title).toEqual(_title);
            expect(_data.excerpt).toEqual(_excerpt);

            signIn(res => {
                var {
                    _id,
                    userName,
                    emailAddr,
                    token
                } = res.body;
                expect(res.status).toEqual(200);
                expect(userName).toBe(_uid.toUpperCase());
                expect(emailAddr).toBe(_email.toUpperCase());
                expect(token).toBeDefined();

                request(app).get(`/api/v1/post/${_data._id}/edit/?_t=${token}`).expect(res => {
                    expect(EditorState.createWithContent(convertFromRaw(JSON.parse(res.body.data.content)))).toBeDefined();
                }).expect(200, done);
            });
        });
    });

    it('POST A COMMENT /api/v1/post/postId/comment', (done) => {
        getPostIdAndSignIn((token, postId, comments) => {
            request(app).post(`/api/v1/post/${postId}/comment?_t=${token}`)
                .send({ remark: _remark })
                .expect(res => {
                    expect(res.body.msg).toBe('Success');
                }).expect(200, done);
        })
    });

    it('REMOVE A COMMENT BY ID', done => {
        getPostIdAndSignIn((token, postId, comments) => {
            var commentId = Array.isArray(comments) ? comments[0]._id : null;
            request(app).delete(`/api/v1/post/${postId}/comment/${commentId}?_t=${token}`).expect(res => {
                expect(res.body.msg).toEqual('Success');
            }).expect(200, done);
        });
    });

    it('REMOVE A POST BY ID: /api/v1/postId/remove', done => {
        getPostIdAndSignIn((token, postId, comments) => {
            request(app).delete(`/api/v1/post/${postId}/remove?_t=${token}`).expect(res => {
                expect(res.body.msg).toEqual('Success');
            }).expect(200, done);
        });
    });

    it('DELETE USER: /api/v1/account/', (done) => {
        signIn(res => {
                var {
                    _id,
                    userName,
                    emailAddr,
                    token
                } = res.body;
                expect(res.status).toEqual(200);
                expect(userName).toBe(_uid.toUpperCase());
                expect(emailAddr).toBe(_email.toUpperCase());
                expect(token).toBeDefined();
                request(app).delete(`/api/v1/account/delete/${_id}`)
                    .expect(res => {
                        var {
                            msg
                        } = res.body;
                        expect(msg).toBe('Success');
                    })
                    .expect(200)
                    .end(done);
            });
    });
});
