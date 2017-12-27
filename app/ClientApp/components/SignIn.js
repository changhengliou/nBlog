import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import request from 'superagent';
import Spinner from './Spinner';
import { isEmpty } from '../../utils/util';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {idClass: '', pwdClass: '', isSignIn: false, disabledSubmit: false};
    }

    componentDidMount() {
        window.addEventListener('keypress', this.onKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.onKeyPress);
    }

    onKeyPress(e) {
        if (e.keyCode != 13)
            return;
        this.form.dispatchEvent(new Event('submit'));
    }

    onFormSubmit(e) {
        var { userId, userPwd } = this.form,
            idClass = isEmpty(userId.value) ? 'form-input-error' : '',
            pwdClass = isEmpty(userPwd.value) ? 'form-input-error' : '';
        this.setState({idClass: idClass, pwdClass: pwdClass});
        if (idClass || pwdClass)
            return;
        this.setState({ disabledSubmit: true });
        e.preventDefault();
        e.stopPropagation();
        request.post('/api/v1/account/signin')
                .send({userId: userId.value, userPwd: userPwd.value})
                .then((res) => {
                    var { userName, token } = JSON.parse(res.text);
                    if (res.ok) {
                        this.setState({isSignIn: false});
                        window.localStorage._t = token;
                    }
                }).catch(err => console.log(err))
                  .then(() => setTimeout(() => this.setState({ disabledSubmit: false }), 500));
    }

    render() {
        return this.state.isSignIn ? <Redirect to={`/${this.state.userName}/me`}/> : (
            <div className='signin-wrapper'>
                <div className='signin-bg'></div>
                <form id='_form' name='signin' ref={ form => this.form = form } onSubmit={ this.onFormSubmit }>
                    <div className='form-panel'>
                        <div className='form-title'>Login to N-Blog</div>
                        <div className='form-body'>
                            <label className='form-label' htmlFor='userId'>Username or email address</label>
                            <input className={`form-input ${this.state.idClass}`} type='text' name='userId'
                                   onBlur={ e => isEmpty(e.target.value) ? 
                                                   this.setState({ idClass: 'form-input-error' }) : 
                                                   this.setState({ idClass: '' }) }/>
                            <label className='form-label' htmlFor='userPwd'>
                                Password
                                <Link className='form-label-right' to='/resetpwd'>forget password ?</Link>
                            </label>
                            <input className={`form-input ${this.state.pwdClass}`} type='password' name='userPwd' 
                                   onBlur={ e => isEmpty(e.target.value) ? 
                                                   this.setState({ pwdClass: 'form-input-error' }) : 
                                                   this.setState({ pwdClass: '' }) }/>
                            <button className='form-login-btn' type="button" disabled={this.state.disabledSubmit}
                                    onClick={ () => { this.form.dispatchEvent(new Event('submit')) } }>
                                    Login { this.state.disabledSubmit ? <Spinner show={true}/> : null }
                            </button>
                        </div>
                        <div className='form-footer'>New to N-Blog ? <Link to='/signup'>Create an account</Link></div>
                    </div>
                </form>
                <div className='signin-intro'>
                    <h1>Built for bloggers</h1>
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

export default SignIn;