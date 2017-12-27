import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Counter from './components/Counter';
import Post from './components/Post';
import NotFound from './components/NotFound';
import DashBoard from './components/DashBoard';
import SignIn from './components/SignIn';
import Setting from './components/Setting';

export const routes = (
    <Switch>
        <Route exact path='/signin' component={ SignIn } />
        <Layout>
            <Switch>
                <Route exact path='/' component={ Counter } />
                <Route exact path='/counter' component={ Counter } />
                <Route exact path='/:userId/me' component={ DashBoard } />
                <Route path='/post' component={ Post }/>
                <Route exact path='/account' component={ Setting } />
                <Route component={ NotFound }/>
            </Switch>
        </Layout>
    </Switch>
);

/**
 * Route
 * @prop {object or string} path url
 * @prop {bool} exact whether or not it should match exactly as path specified
 * @prop {bool} sensitive specified if router will match in a case-sensitive way
 * @prop {object} component a react object to be rendered, when use this, router use 
 * createElement to render, so if use inline function, don't use this because every time
 * this will result in undesirable unmount and mount component
 * @prop {func} render use this when you want to use inline function
 * @prop {func} children this works exactly as render does, but this will be executed even if route
 * is not matched, (match: object) => object
 */

/**
 * BrowserRouter
 * @prop {string} basename the baseline of the url, ex: /app ,Link:/user =>/app/user
 * @prop {func} getUserConfirmation confirmation popup and its callback function
 * @prop {bool} forceRefresh for legacy browser doesn't support history api
 */

/**
 * Link
 * @prop {bool} replace while navigate, replace the history instead of add a new one
 * @prop {string} to url
 */

/**
 * NavLink - special version of link, for active styling
 * @prop {string} to url
 * @prop {string} activeClassName
 * @prop {object} activeStyle
 * @prop {bool} exact if true, the location will match exactly
 * @prop {func} isActive (match: bool, location: string) => bool
 */

 /**
  * Prompt
  * @prop {string or func} message if function, (location: string) => string
  * @prop {bool} when true, successfully navigate to another link
  */

  /**
   * Redirect
   * @prop {string or object} to url
   * @prop {bool} push while true, push a new entry to history instead replace it
   * @prop {string or object} from this is used in switch, while match the rule, redirect to the location
   */
