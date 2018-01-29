import request from 'superagent';

const defaultProps = {
    msg: '',
    posts: []
}

export const actionCreators = {
    getPosts: (pg) => (dispatch, getStore) => { 
        dispatch({ type: 'POST_GET_POSTS_STARTED' });
        request.get(`/api/v1/post?p=${pg}&_t=${window.localStorage._t}`)
               .then(res => {
                   var { data, msg } = JSON.parse(res.text);
                   dispatch({ type: 'POST_GET_POSTS_FINISHED', payload: { posts: data } });
               })
               .catch(err => {
                    dispatch({ type: 'POST_GET_POSTS_ERR', payload: { msg: err } });
               });
    }
};

export const reducer = (state, action) => {
    switch (action.type) {
        // init get my posts
        case 'POST_GET_POSTS_STARTED':
        case 'POST_GET_POSTS_FINISHED':
        case 'POST_GET_POSTS_ERR':
            return { ...state, ...action.payload };
        default:
            return defaultProps;
    }
};