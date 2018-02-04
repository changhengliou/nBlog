import {
    Action,
    Reducer
} from 'redux';
import {
    push
} from 'react-router-redux';
import {
    EditorState,
    convertFromRaw
} from 'draft-js';
import request from 'superagent';
import {
    stateToHTML
} from 'draft-js-export-html';

const defaultProps = {
    _id: '',
    title: '',
    content: '',
    comments: [],
    likes: [],
    views: 0,
    lastEditTime: '',
    status: 'Loading...'
}

export const actionCreators = {
    getPost: (_id) => (dispatch, getStore) => {
        var _t = window.localStorage._t || '';
        dispatch({
            type: 'POSTDETAIL_GET_POST_STARTED'
        });
        request.get(`/api/v1/post/${_id}/edit?_t=${_t}`)
            .then(res => {
                var {
                    data
                } = JSON.parse(res.text);
                dispatch({
                    type: 'POSTDETAIL_GET_POST_FINISHED',
                    payload: {
                        _id: _id,
                        title: data.title,
                        content: stateToHTML(convertFromRaw(JSON.parse(data.content))),
                        comments: data.comments,
                        views: data.views,
                        likes: data.likes,
                        lastEditTime: data.lastEditTime,
                        status: ''
                    }
                });
            })
            .catch(err => {
                console.log(err);
                if (err.status === 403)
                    dispatch(push('/signin'));
                dispatch({
                    type: 'POSTDETAIL_GET_POST_ERR',
                    payload: {
                        status: 'Failed to get the post'
                    }
                });
            })
    },
    onCommentSubmit: (e) => (dispatch, getStore) => {
        e.preventDefault();
        var now = Date.now();
        request.post(`/api/v1/post/${getStore().postdetail._id}/comment`)
            .send({
                _t: window.localStorage._t,
                remark: document.commentForm.remark.value,
                date: now
            })
            .then(res => {
                dispatch({ type: 'POSTDETAIL_ADD_COMMENT', payload: {
                    date: now, 
                    remark: document.commentForm.remark.value, 
                    author: window.sessionStorage.name, 
                    _id: res.body._id
                } });
                document.commentForm.remark.value = '';
            })
            .catch(err => {
                if (err.status === 403)
                    dispatch(push('/signin'));
            });
    },
    onRemoveComment: (e) => (dispatch, getStore) => {
        var commentId = e.target.getAttribute('data-id');
        request.delete(`/api/v1/post/${getStore().postdetail._id}/comment/${commentId}`)
            .send({
                _t: window.localStorage._t
            })
            .then(res => {
                dispatch({ type: 'POSTDETAIL_REMOVE_COMMENT', payload: commentId });
            })
            .catch(err => {
                if (err.status === 403)
                    dispatch(push('/signin'));
            });
    },
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'POSTDETAIL_GET_POST_STARTED':
        case 'POSTDETAIL_GET_POST_FINISHED':
        case 'POSTDETAIL_GET_POST_ERR':
            return { ...state,
                ...action.payload
            };
        case 'POSTDETAIL_ADD_COMMENT':
            var s = JSON.parse(JSON.stringify(state));
            if (!Array.isArray(s.comments))
                return s.comments = [action.payload];
                s.comments.push(action.payload);
            return s;
        case 'POSTDETAIL_REMOVE_COMMENT':
            var s = JSON.parse(JSON.stringify(state));
            s.comments = s.comments.filter(w => w._id !== action.payload);
            return s;
        default:
            return defaultProps;
    }
};