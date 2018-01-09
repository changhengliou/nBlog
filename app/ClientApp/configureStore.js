import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as StoreModule from './store';
import { ApplicationState, reducers } from './store';
import { History } from 'history';
import { createLogger } from 'redux-logger';

export default function configureStore(history, initialState) {
    const logger = createLogger({
        predicate: (getState, action) => { 
            switch(action.type) {
                case '@@router/LOCATION_CHANGE':
                case 'DASHBOARD_PROGRESS_CHANGED':
                case 'DASHBOARD_EDITOR_CHANGED':
                    return false;
                default:
                    return true;
            }
        }
    });
    const windowIfDefined = typeof window === 'undefined' ? null : window;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk, routerMiddleware(history), logger),
        devToolsExtension ? devToolsExtension() : (next) => next
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState);

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    return store;
}

function buildRootReducer(allReducers) {
    return combineReducers(Object.assign({}, allReducers, { routing: routerReducer }));
}
