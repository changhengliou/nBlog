import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import request from 'superagent';
import Spinner from './Spinner';
import AppInput from './AppInput';
import { isEmpty } from '../../utils/util';

class ResetPwdForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form>
                <div className='form-panel'>
                    <h2 className='form-title'>Find your account</h2>
                    <h4 className='form-title'>Please enter your email.</h4>
                    <div className='form-body'>
                        <AppInput type='email' 
                                  name='usrEmail'
                                  errorDisplayType='popover'
                                  onBlur={ e => isEmpty(e.target.value) ? 
                                                this.setState({ idClass: 'form-input-error' }) : 
                                                this.setState({ idClass: '' }) }/>
                        <button className='form-login-btn' 
                                type="button" 
                                disabled={true}
                                onClick={ () => { this.form.dispatchEvent(new Event('submit')) } }>
                            Search { <Spinner show={true}/> }
                        </button>
                        <button className='form-cancel-btn' type="button">
                            <Link className='form-cancel-link' to='/signin'>Cancel</Link>
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

export default ResetPwdForm;