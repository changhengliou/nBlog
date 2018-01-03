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
        required: [true, 'userName is required'], 
        uppercase: true, 
        unique: true,
        validate: isEmailValid
    },
    lastActiveTime: Date,
    posts: [],
    groups: []
});

export const User = mongoose.model('User', UserSchema);