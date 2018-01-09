import request from 'superagent';

export const actionCreators = {
    getPosts: () => (dispatch, getStore) => { 
        dispatch({ type: 'POST_GET_POSTS_STARTED' });
        request.get(`/api/v1/post?p=${pg}&_t=${window.localStorage._t}`)
               .then(res => {
                   var { data, msg } = JSON.parse(res.text);
                   dispatch({ type: 'POST_GET_POSTS_FINISHED', payload: { posts: data } });
               })
               .catch(err => {
                    var { msg } = JSON.parse(res.text);
                    dispatch({ type: 'POST_GET_POSTS_ERR', payload: { msg: msg } });
               });
    },
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'POST_GET_POSTS_STARTED':
            return { count: state.count + 1 };
        case 'DECREMENT_COUNT':
            return { count: state.count - 1 };
    }
    return state || { count: 0 };
};