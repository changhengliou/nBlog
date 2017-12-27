import * as React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import { isEmpty, isEmailValid, isInt } from '../../utils/util';


class AppInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: true,
            value: '',
            errMsg: ''
        };
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.isValid = this.isValid.bind(this);
    }

    static propTypes = {
        // input id
        id: PropTypes.string,
        // input name
        name: PropTypes.string,
        // input type
        type: PropTypes.string.isRequired,
        // input placeholder
        placeholder: PropTypes.string,
        // input onblur listener
        onBlur: PropTypes.func,
        // input onfocus listener
        onFocus: PropTypes.func,
        // input onchange listener
        onChange: PropTypes.func,
        // input onblur listener
        allowEmpty: PropTypes.bool,
        // custom input style
        className: PropTypes.string,
        // input label text, or children element in label
        label: PropTypes.string || PropTypes.element,
        // minlength for input
        minLength: PropTypes.number,
        // maxlength for input
        maxLength: PropTypes.number
    }

    static defaultProps = {
        id: null,
        name: null,
        type: 'text',
        placeholder: null,
        onBlur: null,
        onFocus: null,
        onChange: null,
        allowEmpty: false,
        className: '',
        label: null,
        minLength: 0,
        maxLength: 50
    }

    onBlur(e) {
        e.preventDefault();
        this.setState({ value: e.target.value, isValid: this.isValid(e.target.value) });
        this.props.onBlur ? this.props.onBlur(e) : null;
    }

    onFocus(e) {
        e.preventDefault();
        this.setState({ value: e.target.value, isValid: true });
        this.props.onFocus ? this.props.onFocus(e) : null;
    }

    onChange(e) {
        e.preventDefault();
        this.setState({ value: e.target.value });
        this.props.onChange ? this.props.onChange(e) : null;
    }

    isValid(val) {
        var { type, allowEmpty, maxLength, minLength } = this.props,
            value = val || this.state.value;
        
        if (!allowEmpty)
            if(isEmpty(value)) {
                this.setState({ errMsg: 'Required field' });
                return false;
            }
    
        if (value.length > maxLength) {
            this.setState({ errMsg: `Max input characters are ${maxLength}` });
            return false;
        }

        if (value.length < minLength) {
            this.setState({ errMsg: `You need at least ${minLength} characters` });
            return false;
        }

        switch (type) {
            case 'email':
                if (!isEmailValid(value)) {
                    this.setState({ errMsg: 'Email is not valid' });
                    return false;
                }
                break;
            case 'number':
                if (isNaN(parseInt(value))) {
                    this.setState({ errMsg: 'Number is not valid' });
                    return false;
                }
                break;
        }
        return true;
    }

    render() {
        var { type, 
              name, 
              id, 
              placeholder, 
              onBlur, 
              onChange, 
              allowEmpty, 
              className, 
              label,
              minLength, 
              maxLength } = this.props,
            { value, isValid } = this.state;
        return (
            <div className='form-group' style={ isValid ? null : { height: '62px' } }>
                { label ? <label htmlFor={ id }>{ label }</label> : null }
                <input className={ `form-input ${className} ${ isValid ? '' : 'form-input-error' }` } 
                       maxLength={ maxLength }
                       minLength={ minLength }
                       type={ type } 
                       name={ name } 
                       id={ id }
                       placeholder={ placeholder }
                       onFocus={ this.onFocus }
                       onBlur={ this.onBlur }
                       onChange={ this.onChange }
                       value={ value }/>
                { isValid ? null : <div className='error-hint-box'>{ this.state.errMsg }</div> }
            </div>
        );
    }
}

export default AppInput;