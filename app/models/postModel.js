import mongoose, { Schema } from 'mongoose';
import { gethash } from '../utils/util';
import { isEmailValid, isEmpty } from '../utils/util';

const postSchema = new Schema({
    title: { 
        type: String, 
        required: [true, 'title is required'], 
        validate: str => !isEmpty(str)
    },
    excerpt: String,
    content: String,
    comments: Array,
    views: {
        type: Number,
        default: 0
    },
    viewsBy: Array,
    likes: Array,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastEditTime: {
        type: Date,
        default: Date.now()
    },
    labels: Array,
    group: Array
});

class PostAddOn {

}

postSchema.loadClass(PostAddOn);

export const commentSchema = new Schema({
    remark: {
        type: String,
        required: [true, 'remark is required'],
        validate: str => !isEmpty(str)
    },
    author: {
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    reply: Array,
    date: {
        type: Date,
        default: Date.now()
    }
});

class CommentAddOn {

}

commentSchema.loadClass(CommentAddOn);

export const Post = mongoose.model('Post', postSchema);
export const Comment = mongoose.model('Comment', commentSchema);