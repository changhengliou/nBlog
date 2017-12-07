export const actionCreators = {
    progressChanged: (progress) => (dispatch, getStore) => dispatch({ type: 'PAGELOAD_PROGRESS_CHANGED', payload: process })
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'PAGELOAD_PROGRESS_CHANGED':
            return { progress: action.payload };
    }
    return state || { progress: 0 };
}