import 'core-js/es6/map';
import 'core-js/es6/set';
import { load } from 'webfontloader';
import './css/site.css';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import { ApplicationState }  from './store';
import * as RoutesModule from './routes';

let routes = RoutesModule.routes;

// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
// const history = createBrowserHistory({ basename: baseUrl });
const history = createBrowserHistory();

const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

function renderApp() {
    load({
        google: {
            families: ['Ubuntu']
        },
        custom: {
            famalies: ['cwTeXYen'],
            urls: ['https://fonts.googleapis.com/earlyaccess/cwtexyen.css']    
        }
    });
    ReactDOM.hydrate(
        // <AppContainer>
            <Provider store={ store }>
                <ConnectedRouter history={ history } children={ routes } />
            </Provider>,
        // </AppContainer>,
        document.getElementById('react-app')
    );
};
renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require('./routes').routes;
        renderApp();
    });
}
