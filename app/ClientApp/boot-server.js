import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, matchPath, StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { routes } from './routes';
import configureStore from './configureStore';


const spaRouterMiddleware = (req, res, next) => {
    const store = configureStore(createMemoryHistory());
    store.dispatch(replace(req.url));
    
    // Prepare an instance of the application and perform an inital render that will
    // cause any async tasks (e.g., data access) to begin
    const routerContext = { statusCode: 200, requestUrl: req.url };
    const app = (
        <Provider store={ store }>
            <StaticRouter context={ routerContext } location={ req.url } children={ routes }/>
        </Provider>
    );

    const html = renderToString(app);

    if (routerContext.url) 
        res.redirect(302, routerContext.url);
    else if (routerContext.statusCode >= 400) {
        res.status(routerContext.statusCode).render('index', { helpers: {
            app: html
        }})
    }
    else {   
        res.render('index', { helpers: {
            app: html,
            footer: `<script>window.initialReduxState=${JSON.stringify(store.getState())}</script>`
        }});            
    }
};

export default spaRouterMiddleware;