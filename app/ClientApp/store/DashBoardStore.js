import { EditorState } from 'draft-js';

const defaultProps = {
    progress: 0,
    editorState: EditorState.createEmpty()
};

export const actionCreators = {
    onProgressChanged: (progress) => (dispatch, getStore) => dispatch({ type: 'DASHBOARD_PROGRESS_CHANGED', payload: progress }),
    onEditorChanged: (e) => (dispatch, getStore) => dispatch({ type: 'DASHBOARD_EDITOR_CHANGED', payload: e }),
    getPosts: (page, who) => (dispatch, getStore) => { 
        dispatch({ type: 'DASHBOARD_GET_POSTS_STARTED' });
        request.get(`/api/v1/post?p=${page}&w=${who}&_t=${window.localStorage._t}`)
               .then(res => {
                   var { data, msg } = JSON.parse(res.text);
                   dispatch({ type: 'DASHBOARD_GET_POSTS_FINISHED', payload: { posts: data } });
               })
               .catch(err => {
                    var { msg } = JSON.parse(res.text);
                    dispatch({ type: 'DASHBOARD_GET_POSTS_ERR', payload: { msg: msg } });
               });
    },
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'DASHBOARD_PROGRESS_CHANGED':
            return { ...state, progress: action.payload };
        case 'DASHBOARD_EDITOR_CHANGED':
        case 'DASHBOARD_GET_POSTS_STARTED':
        case 'DASHBOARD_GET_POSTS_FINISHED':
        case 'DASHBOARD_GET_POSTS_ERR':
            return { ...state, editorState: action.payload };
        default:
            return defaultProps;
    }
}