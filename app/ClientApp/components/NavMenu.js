import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link, browserHistory } from 'react-router-dom';

export class NavMenu extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static contextTypes = {
        router: PropTypes.object
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
                            <NavLink exact to={ '/changheng/me' } activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/post' } 
                                     activeClassName='active' 
                                     isActive={ (a, b) => (b.pathname === '/' || a) ? true : false }>
                                <span className='glyphicon glyphicon-th-list'></span> Posts
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/account' } activeClassName='active'>
                                <span className='glyphicon glyphicon-education'></span> Account
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/admin' } activeClassName='active'>
                                <span className='glyphicon glyphicon-education'></span> Manage db
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/signin' } activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Signin
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        );
    }
}
