import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import request from 'superagent';
import Spinner from './Spinner';
import AppInput from './AppInput';
import { isEmpty } from '../../utils/util';

class SignUpForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        [ 'onInputBlur', 
          'onInputChange', 
          'isValidFunc', 
          'onFormSubmit' ].map(fn => this[fn] = this[fn].bind(this));

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
            _pwd2Valid: false,
            // response message
            resMsg: ''
        };
    }

    static contextTypes = {
        router: PropTypes.object
    }

    onInputBlur(e, state) {
        var nextState = { ...this.state },
            { name } = e.target,
            { isValid } = state;

        if (this.panel.clientHeight > 380)
            nextState.errorDisplayType = 'text';
        else
            nextState.errorDisplayType = 'popover';
        switch(name) {
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
        this.setState(nextState, () => {
            if (name !== 'userPwd')
                return;
            // a workaroud to force update input 2
            var ele = document.querySelector('input[name="userPwd2"]');
            ele.focus();
            ele.blur();
        });
    }

    onInputChange(e, state) {
        var { name, value } = e.target,
            nextState = { ...this.state };
        if (name === 'userPwd') {
            nextState._pwd = value;
        } else if (name === 'userPwd2')
            nextState._pwd2 = value;

        this.setState(nextState);
    }

    // custom validation function in a pipeline checking manner, for checking 2 pwds match
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

    onFormSubmit(e) {
        var { userName, emailAddr, userPwd, userPwd2 } = this.form,
            { _nameValid, _emailValid, _pwdValid, _pwd2Valid } = this.state;
        if (!(_nameValid && _emailValid && _pwdValid && _pwd2Valid))
            return;
        e.preventDefault();
        e.stopPropagation();
        request.post('/api/v1/account/signup')
               .send({ 
                    userName: userName.value,
                    emailAddr: emailAddr.value,
                    userPwd: userPwd.value,
                    userPwd2: userPwd2.value
                })
                .then(res => {
                    var { msg, token, id } = JSON.parse(res.text);
                    if (res.ok) {
                        window.localStorage._t = token;
                        this.context.router.history.push(`/${id}/me`);
                    } else if (res.badRequest) {
                        this.setState({ resMsg: msg });
                    }
                })
                .catch(err => console.log(err));
    }

    render() {
        var { errorDisplayType, _pwd, _pwd2, _pwd2Msg, _nameValid, _emailValid, _pwdValid, _pwd2Valid, resMsg } = this.state;
        return (
            <form ref={ form => this.form = form } onSubmit={ this.onFormSubmit }>
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
                        <button className='form-login-btn' type="button" disabled={ !(_nameValid && _emailValid && _pwdValid && _pwd2Valid) }
                            onClick={ () => { this.form.dispatchEvent(new Event('submit')) } }>
                            Create Account { <Spinner show={ false }/> }
                        </button>
                        <span style={{ position: 'relative', top: '0', left: '1em' }}>
                            or <Link to='/signin' className='form-link'>Signin</Link>
                        </span>
                        <div style={ { color: 'red', marginTop: '0.5em' } }>{ resMsg }</div>
                        <div style={ { fontSize: '0.8em', color: '#999', marginTop: '0.5em'} }>
                            By signing up, you agree to our Terms of Service.
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default SignUpForm;