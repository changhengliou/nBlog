import {
    EditorState,
    convertToRaw,
    convertFromRaw
} from 'draft-js';
import request from 'superagent';
import {
    isEmpty
} from '../../utils/util';
import {
    push
} from 'react-router-redux';
const defaultProps = {
    progress: 0,
    _id: '',
    title: '',
    excerpt: '',
    editorState: EditorState.createEmpty(),
    editorMsg: '',
    myPostMsg: '',
    myPostData: []
};
const emptyEditor = {
    _id: '',
    title: '',
    excerpt: '',
    editorState: EditorState.createEmpty()
}

export const actionCreators = {
    getMyPosts: () => (dispatch, getStore) => {
        dispatch({
            type: 'DASHBOARD_GETUSER_POSTS_STARTED'
        });
        request.get(`/api/v1/post?_t=${window.localStorage._t}`)
            .on('progress', e => dispatch({
                type: 'DASHBOARD_PROGRESS_CHANGED',
                payload: e.percent
            }))
            .then(res => {
                if (res.ok) {
                    var {
                        data
                    } = JSON.parse(res.text);
                    dispatch({
                        type: 'DASHBOARD_GETUSER_POSTS_FINISHED',
                        payload: {
                            myPostData: data
                        }
                    });
                }
            })
            .catch(err => {
                if (err.status === 403)
                    dispatch(push('/signin'));
                dispatch({
                    type: 'DASHBOARD_GETUSER_POSTS_ERR',
                    payload: 'Failed to get post'
                });
            });
    },
    onEditorChanged: (e) => (dispatch, getStore) => dispatch({
        type: 'DASHBOARD_EDITOR_CHANGED',
        payload: e
    }),
    onTitleChanged: (e) => (dispatch, getStore) => dispatch({
        type: 'DASHBOARD_TITLE_CHANGED',
        payload: e.target.value
    }),
    onExcerptChanged: (e) => (dispatch, getStore) => dispatch({
        type: 'DASHBOARD_EXCERPT_CHANGED',
        payload: e.target.value
    }),
    onPublishBtnClicked: () => (dispatch, getStore) => {
        var {
            title,
            excerpt,
            editorState,
            _id
        } = getStore().dashboard,
            _url;
        if (isEmpty(title)) {
            dispatch({
                type: 'DASHBOARD_TITLE_NULL',
                payload: `Title can't be null.`
            });
            return;
        }
        if (isEmpty(excerpt)) {
            dispatch({
                type: 'DASHBOARD_EXCERPT_NULL',
                payload: `Excerpt can't be null.`
            });
            return;
        }
        if (!_id)
            _url = '/api/v1/post/create';
        else
            _url = `/api/v1/post/${_id}/edit`;

        dispatch({
            type: 'DASHBOARD_PUBLISH_STARTED'
        });
        request.post(_url)
            .send({
                title: title,
                excerpt: excerpt,
                editorState: convertToRaw(editorState.getCurrentContent()),
                _t: window.localStorage._t
            })
            .then(res => {
                dispatch({
                    type: 'DASHBOARD_PUBLISH_FINISHED',
                    payload: {
                        title: '',
                        excerpt: '',
                        editorState: EditorState.createEmpty(),
                        editorMsg: 'Successfully publish the post!'
                    }
                });
                var {
                    data,
                    msg
                } = JSON.parse(res.text);
                console.log(data, msg);
            })
            .catch(err => {
                if (err.status === 403)
                    dispatch(push('/signin'));
                dispatch({
                    type: 'DASHBOARD_PUBLISH_ERR',
                    payload: err
                });
            });
    },
    onDraftBtnClicked: (e) => (dispatch, getStore) => dispatch({
        type: 'DASHBOARD_DRAFT_CLICKED',
        payload: e
    }),
    onDiscardBtnClicked: () => (dispatch, getStore) => {
        var {
            _id
        } = getStore().dashboard;
        if (!_id) {
            dispatch({
                type: 'DASHBOARD_DISCARD_CLICKED',
                payload: emptyEditor
            });
            return;
        }
        dispatch({
            type: 'DASHBOARD_DISCARD_STARTED'
        });
        request.del(`/api/v1/post/${_id}/remove`)
            .then(res => {
                dispatch({
                    type: 'DASHBOARD_DISCARD_FINISHED',
                    payload: {
                        editorMsg: 'Successfully remove the post.',
                        ...emptyEditor
                    }
                });
            })
            .catch(err => {
                console.log(err);
                if (err.status === 403)
                    dispatch(push('/signin'));
                dispatch({
                    type: 'DASHBOARD_DISCARD_ERR',
                    payload: {
                        editorMsg: 'Failed to remove the post.'
                    }
                });
            });
    },
    onPreviewBtnClicked: (e) => (dispatch, getStore) => dispatch({
        type: 'DASHBOARD_PREVIEW_CLICKED',
        payload: e
    }),
    getPosts: (page, who) => (dispatch, getStore) => {
        dispatch({
            type: 'DASHBOARD_GET_POSTS_STARTED'
        });
        request.get(`/api/v1/post?p=${page}&w=${who}&_t=${window.localStorage._t}`)
            .then(res => {
                var {
                    data,
                    msg
                } = JSON.parse(res.text);
                dispatch({
                    type: 'DASHBOARD_GET_POSTS_FINISHED',
                    payload: {
                        posts: data
                    }
                });
            })
            .catch(err => {
                if (err.status === 403)
                    dispatch(push('/signin'));
                dispatch({
                    type: 'DASHBOARD_GET_POSTS_ERR',
                    payload: {
                        myPostMsg: err
                    }
                });
            });
    },
    onEditBtnClick: (event, props) => (dispatch, getStore) => {
        var {
            _id
        } = props;
        dispatch({
            type: 'DASHBOARD_GET_EDIT_POST_STARTED'
        });
        request.get(`/api/v1/post/${_id}/edit`)
            .then(res => {
                var {
                    data
                } = JSON.parse(res.text);
                dispatch({
                    type: 'DASHBOARD_GET_EDIT_POST_FINISHED',
                    payload: {
                        _id: _id,
                        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(data.content))),
                        title: data.title,
                        excerpt: data.excerpt
                    }
                });
            })
            .catch(err => {
                if (err.status === 403)
                    dispatch(push('/signin'));
                dispatch({
                    type: 'DASHBOARD_GET_EDIT_POST_ERR',
                    payload: {
                        myPostMsg: err
                    }
                });
            });
    },
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'DASHBOARD_PROGRESS_CHANGED':
            return { ...state,
                progress: action.payload
            };
        case 'DASHBOARD_EDITOR_CHANGED':
            return { ...state,
                editorState: action.payload
            };
            // not used for now
        case 'DASHBOARD_GET_POSTS_STARTED':
        case 'DASHBOARD_GET_POSTS_FINISHED':
        case 'DASHBOARD_GET_POSTS_ERR':
            // get edit post
        case 'DASHBOARD_GET_EDIT_POST_STARTED':
        case 'DASHBOARD_GET_EDIT_POST_FINISHED':
            return { ...state,
                ...action.payload
            };
            // get initial user posts
        case 'DASHBOARD_GETUSER_POSTS_STARTED':
        case 'DASHBOARD_GETUSER_POSTS_FINISHED':
            return { ...state,
                ...action.payload
            };
        case 'DASHBOARD_GETUSER_POSTS_ERR':
            return { ...state,
                myPostMsg: action.payload
            };
            // editor specific actions
        case 'DASHBOARD_TITLE_CHANGED':
            return { ...state,
                title: action.payload
            };
        case 'DASHBOARD_EXCERPT_CHANGED':
            return { ...state,
                excerpt: action.payload
            };
        case 'DASHBOARD_DISCARD_CLICKED':
            return { ...state,
                ...action.payload
            };
        case 'DASHBOARD_TITLE_NULL':
        case 'DASHBOARD_EXCERPT_NULL':
        case 'DASHBOARD_PUBLISH_ERR':
        case 'DASHBOARD_GET_EDIT_POST_ERR':
            return { ...state,
                editorMsg: action.payload
            };
            // create or update posts
        case 'DASHBOARD_PUBLISH_STARTED':
        case 'DASHBOARD_PUBLISH_FINISHED':
            // remove posts
        case 'DASHBOARD_DISCARD_STARTED':
        case 'DASHBOARD_DISCARD_FINISHED':
        case 'DASHBOARD_DISCARD_ERR':
            return { ...state,
                ...action.payload
            };
        default:
            return defaultProps;
    }
}