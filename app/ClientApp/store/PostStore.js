export const actionCreators = {
    increment: () => (dispatch, getStore) => dispatch({ type: 'INCREMENT_COUNT' }),
    decrement: () => (dispatch, getStore) => dispatch({ type: 'DECREMENT_COUNT' })
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'INCREMENT_COUNT':
            return { count: state.count + 1 };
        case 'DECREMENT_COUNT':
            return { count: state.count - 1 };
    }
    return state || { count: 0 };
};