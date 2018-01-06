import express from 'express';
import moongose from 'mongoose';
import { Post } from '../models/postModel';
import { isEmpty } from '../utils/util';


const router = express.Router();
const POSTS_PER_PAGE = 30;

/**
 * get all posts
 * @param {number} p number of page
 */
router.get('/', (req, res, next) => {
    var { p } = req.query;
    Post.find()
        .limit(POSTS_PER_PAGE)
        .skip(p * POSTS_PER_PAGE)
        .sort('-lastEditTime')
        .populate({
            path: 'author',
            model: 'User',
            select: '_id name'
        })
        .select('_id title excerpt lastEditeTime views')
        .lean()
        .exec()
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
        res.status(500).json({ msg: 'Failed to get the post' })
    });
});

/**
 * edit post by id
 */
router.post('/:postId/edit', (req, res, next) => {
    var { postId } = req.params,
        { title, excerpt, content } = req.body; 
    
    Post.findById(postId)
        .populate('author')
        .select('_id title excerpt content lastEditeTime views author._id author.name')
        .exec()
        .then(obj => {
            obj.title = title;
            obj.excerpt = excerpt;
            obj.content = content;
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
