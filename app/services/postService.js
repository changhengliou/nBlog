import mongoose from 'mongoose';
import { Post } from '../models/postModel';

export default class PostService {
    /**
     * @param {number} limit - number of articles showed in one page 
     * @param {number} page - the number of page displayed now
     * @returns {Promise} 
     */
    static getPosts(limit, page) {
        return Post.aggregate([ 
            { $limit: limit },
            { $skip: page * limit },
            { $sort: { lastEditTime: -1 } },
            { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authors" } },
            { $unwind: "$authors" },
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
                    author: "$authors",
                    lastEditTime: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$lastEditTime", timezone: "+08:00" } }
                }
            } ])
            .exec()
    }

    /**
     * @param {ObjectId} postId
     * @param {boolean} addViews 
     * @returns {Promise}
     */
    static getPostById(postId, addViews) {
        var query = Post.findById(postId).populate('author', 'email name');
        if (!addViews)
            return query.lean().exec();
        return query.exec().then(obj => {
            obj.views += 1;
            return obj.save();
        });
    }
}