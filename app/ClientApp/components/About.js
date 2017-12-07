import * as React from 'react';
import { connect } from 'react-redux';
import * as AboutStore from '../store/AboutStore';
import { Link } from 'react-router-dom';
class About extends React.Component {
    render() {
        return (
            <div>
                <h1>About</h1>
                <nav>
                    <ul className='clearfix'>
                        <li className='level-1'>
                            <Link to='#'>link level-1</Link>
                            <ul>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                            </ul>
                        </li>
                        <li className='level-1'>
                            <Link to='#'>link level-1</Link>
                            <ul>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                            </ul>
                        </li>
                        <li className='level-1'>
                            <Link to='#'>link level-1</Link>
                            <ul>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                                <li><Link to='/'>link</Link></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default connect(
    (state) => state.about, 
    AboutStore.actionCreators
)(About);