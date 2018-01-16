import { Action, Reducer } from 'redux';
import { EditorState, convertFromRaw } from 'draft-js';
import request from 'superagent';
import { stateToHTML } from 'draft-js-export-html';

const defaultProps = {
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
        dispatch({ type: 'POSTDETAIL_GET_POST_STARTED' });
        request.get(`/api/v1/post/${_id}/edit?_t=${_t}`)
               .then(res => {
                    var { data } = JSON.parse(res.text);
                    dispatch({ type: 'POSTDETAIL_GET_POST_FINISHED', payload: {
                        title: data.title,
                        content: stateToHTML(convertFromRaw(JSON.parse(data.content))),
                        views: data.views,
                        likes: data.likes,
                        lastEditTime: data.lastEditTime,
                        status: ''
                    } });
               })
               .catch(err => {
                    console.log(err);
                    dispatch({ type: 'POSTDETAIL_GET_POST_ERR', payload: { status: 'Failed to get the post' } });
               })
    },
    onCommentSubmit: (e) => (dispatch, getStore) => {
        console.log(e);
        e.preventDefault();
    }
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'POSTDETAIL_GET_POST_STARTED':
        case 'POSTDETAIL_GET_POST_FINISHED':
        case 'POSTDETAIL_GET_POST_ERR':
            return { ...state, ...action.payload };
        default:
            return defaultProps;
    }
};

