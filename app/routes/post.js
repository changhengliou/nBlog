import express from 'express';
import moongose from 'mongoose';
import jwt from 'jsonwebtoken';
import Config from '../config/config';
import { Post } from '../models/postModel';
import { isEmpty, getDateString, getDateTimeString } from '../utils/util';
import { sendError } from '../utils/common';
import { isNumber } from 'util';

const router = express.Router();
const POSTS_PER_PAGE = 30;

/**
 * get all posts
 * @param {number} p number of page
 * @param {string} who request specific author
 * @param {string} _t client token
 */
router.get('/', (req, res, next) => {
    var { p } = req.query;
    if (!isNumber(p) || p < 0)
        p = 0;
    Post.aggregate([ 
        { $limit: POSTS_PER_PAGE },
        { $skip: p * POSTS_PER_PAGE },
        { $sort: { lastEditTime: -1 } },
        { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authors" } },
        {
            $project: {
                _id: 1,
                title: 1,
                excerpt: 1,
                group: 1,
                labels: 1,
                likes: 1,
                viewsBy: 1,
                views: 1,
                comments: 1,
                "authors._id": 1,
                "authors.name": 1,
                "authors.email": 1,
                lastEditTime: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$lastEditTime", timezone: "+08:00" } }
            }
        } ])
        .then(s => {
            res.send({ data: s });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: 'Failed to get posts' })
        });
});

/**
 * get post by id
 */
router.get('/:postId/edit', (req, res, next) => {
    var { postId } = req.params;
    
    Post.findById(postId).lean().exec().then(s => {
        res.send({ data: s });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Failed to get the post.' })
    });
});

/**
 * create a new post
 */
router.post('/create', (req, res) => {
    var { title, excerpt, editorState, _t } = req.body;
    if (isEmpty(title) || isEmpty(excerpt) || isEmpty(_t)) {
        res.status(400).json({ msg: 'Invalid form.' });
        return;
    }
    jwt.verify(_t, Config.SERVER_SECRET, (err, object) => {
        if (err) {
            res.status(403).json({ msg: err });
            return;
        }
        
        var post = new Post({
                title: title,
                excerpt: excerpt,
                content: JSON.stringify(editorState),
                author: object._id
            });
            post.save()
                .then(obj => {
                    res.json({ msg: `Successfully save the post, id = ${obj._id}`});
                })
                .catch(err => sendError(res, err, 'Failed to save your post.'));
    });
});

/**
 * edit post by id
 */
router.post('/:postId/edit', (req, res, next) => {
    var { postId } = req.params,
        { title, excerpt, editorState, _t } = req.body; 
    
    Post.findById(postId)
        .populate('author')
        .select('_id title excerpt content lastEditeTime views author._id author.name')
        .exec()
        .then(obj => {
            obj.title = title;
            obj.excerpt = excerpt;
            obj.content = JSON.stringify(editorState);
            obj.lastEditTime = Date.now();
            obj.save().then(obj => {
                res.json({ msg: 'Success' });
            })
            .catch(err => {
                res.status(500).json({ msg: 'Failed to save post' });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: 'Failed to save post' });
        });
});

/**
 * remove post by id
 */
router.delete('/:postId/remove', (req, res, next) => {
    var { postId } = req.params;
    Post.findByIdAndRemove(postId).then(obj => {
        res.json({ msg: 'Success', obj: obj });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Failed to remove post' });
    });
});

/**
 * comment on post by id
 */
router.get('/:postId/comment', (req, res, next) => {
    res.send(`${req.originalUrl}`);
});

/**
 * remove a comment
 */
router.get('/:postId/comment/:commentId/remove', (req, res, next) => {
    var params = '';
    Object.keys(req.params).map((obj) => {
        params += `key = ${obj}, value = ${req.params[obj]}\n`;
    });
    var queries = '';
    Object.keys(req.query).map((obj) => {
        params += `key = ${obj}, value = ${req.query[obj]}\n`;
    });
    res.send(`${req.originalUrl} ${params} ${queries}`);
});

export default (app) => app.use('/api/v1/post', router);
