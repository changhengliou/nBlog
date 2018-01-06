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
    comment: Array,
    like: Array,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastEditTime: {
        type: Date,
        default: Date.now()
    },
    views: {
        type: Number,
        default: 0
    }
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