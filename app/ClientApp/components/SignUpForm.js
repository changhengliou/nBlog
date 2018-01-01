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
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.isValidFunc = this.isValidFunc.bind(this);
        this.state = {
            // error display type, if height overlap former component, switch to text display mode
            errorDisplayType: 'popover',
            // input value
            _pwd: '',
            _pwd2: '',
            // input validator state 
            _nameValid: false,
            _emailValid: false,
            _pwdValid: false,
            _pwd2Valid: false
        };
    }

    onInputBlur(e, state) {
        var nextState = { ...this.state },
            { isValid } = state;

        if (this.panel.clientHeight > 400)
            nextState.errorDisplayType = 'text';
        else
            nextState.errorDisplayType = 'popover';
        switch(e.target.name) {
            case 'userName':
                nextState._nameValid = isValid;
                break;
            case 'emailAddr':
                nextState._emailValid = isValid;
                break;
            case 'userPwd':
                nextState._pwdValid = isValid;
                break;
            case 'userPwd2':
                nextState._pwd2Valid = isValid;
                break;
        }
        this.setState(nextState);
    }

    onInputChange(e, state) {
        var { name, value } = e.target,
            nextState = { ...this.state };
        if (name === 'userPwd')
            nextState._pwd = value;
        else if (name === 'userPwd2')
            nextState._pwd2 = value;
        this.setState(nextState);
    }

    isValidFunc(val) {
        var { _pwd, _pwd2 } = this.state;
        return _pwd2 != _pwd ? { 
                isValid: false, 
                errorMsg: `Passwords don't match. Try again?`
            } : {
                isValid: true, 
                errorMsg: null
            }
    }

    render() {
        var { errorDisplayType, _pwd, _pwd2, _pwd2Msg } = this.state;
        return (
            <form ref={ form => this.form = form }>
                <div className='form-panel' ref={ p => this.panel = p }>
                    <h2 className='form-title'>Signup</h2>
                    <h4 className='form-title'>It's free and it always will be.</h4>
                    <div className='form-body'>
                        <AppInput type='text' 
                                  name='userName' 
                                  placeholder='Username'
                                  errorDisplayType={ errorDisplayType }
                                  onBlur={ this.onInputBlur }/>
                        <AppInput type='email' 
                               name='emailAddr' 
                               placeholder='Email address'
                               errorDisplayType={ errorDisplayType }
                               onBlur={ this.onInputBlur }/>
                        <AppInput type='password' 
                                  name='userPwd'
                                  value={ _pwd }
                                  placeholder='Password'
                                  minLength={4}
                                  maxLength={40}
                                  errorDisplayType={ errorDisplayType }
                                  onBlur={ this.onInputBlur }
                                  onChange={ this.onInputChange }/>
                        <AppInput type='password' 
                                  name='userPwd2'  
                                  value={ _pwd2 }
                                  placeholder='Re-enter password'
                                  minLength={4}
                                  maxLength={40}
                                  isValidFunc={ this.isValidFunc }
                                  errorDisplayType={ errorDisplayType }
                                  onBlur={ this.onInputBlur }
                                  onChange={ this.onInputChange }/>
                        <button className='form-login-btn' type="button" disabled={ true }
                            onClick={ () => { this.form.dispatchEvent(new Event('submit')) } }>
                            Create Account { <Spinner show={ true }/> }
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