import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

class Signin extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='signin-wrapper'>
                <div className='signin-bg'></div>
                    { this.props.children }
                <div className='signin-intro'>
                    <h2>Crafted for bloggers</h2>
                    <div className='signin-intro-text'>
                        N-Blog is a platform born for your creativity from trivial things to vital ideas, 
                        small plans to big ambition.  
                        Dream big, think bigger, doing as possobly as you can. 
                        This is a free world for you to create any bold idea.
                    </div>
                </div>
            </div>
        );
    }
}

export default Signin;