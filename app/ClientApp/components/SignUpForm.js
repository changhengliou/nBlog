import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import request from 'superagent';
import Spinner from './Spinner';
import AppInput from './AppInput';
import { isEmpty } from '../../utils/util';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form>
                <div className='form-panel'>
                    <h2 className='form-title'>Signup</h2>
                    <h4 className='form-title'>It's free and it always will be.</h4>
                    <div className='form-body'>
                        <AppInput type='text' 
                                  name='userName' 
                                  placeholder='Username'
                                  minLength={4}
                                  onBlur={ e => isEmpty(e.target.value) ? 
                                                this.setState({ idClass: 'form-input-error' }) : 
                                                this.setState({ idClass: '' }) }/>
                        <AppInput type='email' 
                               name='emailAddr' placeholder='Email address'
                               onBlur={ e => isEmpty(e.target.value) ? 
                                             this.setState({ idClass: 'form-input-error' }) : 
                                             this.setState({ idClass: '' }) }/>
                        <AppInput type='password' 
                                  name='userPwd' 
                                  placeholder='Password'
                                  minLength={4}
                                  maxLength={40}
                                  onBlur={ e => isEmpty(e.target.value) ? 
                                                this.setState({ pwdClass: 'form-input-error' }) : 
                                                this.setState({ pwdClass: '' }) }/>
                        <AppInput type='password' 
                                  name='userPwd2'  
                                  placeholder='Re-enter password'
                                  minLength={4}
                                  maxLength={40}
                                  onBlur={ e => isEmpty(e.target.value) ? 
                                                this.setState({ pwdClass: 'form-input-error' }) : 
                                                this.setState({ pwdClass: '' }) }/>
                        <button className='form-login-btn' type="button" disabled={true}
                            onClick={ () => { this.form.dispatchEvent(new Event('submit')) } }>
                            Create Account { <Spinner show={true}/> }
                        </button>
                        <span style={{ position: 'relative', top: '0', left: '1em' }}>
                            or <Link to='/signin'>Signin</Link>
                        </span>
                        <div style={{ fontSize: '0.8em', color: '#999', marginTop: '0.5em'}}>
                            By signing up, you agree to our Terms of Service.
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default SignUpForm;