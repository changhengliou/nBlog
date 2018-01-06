import mongoose, { Schema } from 'mongoose';
import { gethash } from '../utils/util';
import { isEmailValid, isEmpty } from '../utils/util';

export const UserSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'userName is required'], 
        unique: true,
        uppercase: true,
        validate: str => !isEmpty(str)
    },
    passwordHash: { type: String, set: gethash },
    email: { 
        type: String, 
        required: [true, 'email is required'], 
        uppercase: true, 
        unique: true,
        validate: isEmailValid
    },
    gender: {
        type: String,
        enum: [ "male", "female" ]
    },
    avatar: String,
    selfIntro: String,
    lastActiveTime: Date,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    groups: []
});

export const User = mongoose.model('User', UserSchema);