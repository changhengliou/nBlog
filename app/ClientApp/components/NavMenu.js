import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link, browserHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';

export class NavMenu extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { urlText: 'Signin' };
    }

    static contextTypes = {
        router: PropTypes.object
    }

    componentWillMount() {
        if (typeof window === 'object') {
            var token = jwt.decode(window.localStorage._t);
            if (token) {
                window.sessionStorage.name = token.name;
                window.sessionStorage.email = token.email;
                this.setState({ urlText: 'SignOut', name: token.name });
            }
        }
    }

    componentWillUnmount() {
        if (typeof window === 'object') {
            if (jwt.decode(window.localStorage._t)) {
                this.setState({ urlText: 'Signin' });
                window.localStorage._t = null;
            }
        }
    }

    render() {
        return (
        <div className='main-nav'>
                <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={ '/' }>Changheng</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink exact to={ `/${this.state.name}/me` } activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/post' } 
                                     activeClassName='active' 
                                     isActive={ (a, b) => {
                                        if (b.pathname.split('/')[1].length === 24) return true;
                                        return (b.pathname === '/' || a) ? true : false;
                                     } }>
                                <span className='glyphicon glyphicon-th-list'></span> Posts
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/account' } activeClassName='active'>
                                <span className='glyphicon glyphicon-education'></span> Account
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact strict to={ '/admin' } activeClassName='active'>
                                <span className='glyphicon glyphicon-education'></span> Manage db
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/signin' } activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> { this.state.urlText }
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        );
    }
}
