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
            errorMsg: ''
        };

        [
            'onBlur',
            'onFocus',
            'onChange',
            'isValid',
            'getErrorDisplay',
            'getErrorDisplayStyle'
        ].map(fn => this[fn] = this[fn].bind(this));
    }

    static propTypes = {
        // input id
        id: PropTypes.string,
        // input name
        name: PropTypes.string,
        // input type
        type: PropTypes.string.isRequired,
        // input value, specified if you want a controlled component
        value: PropTypes.any,
        // custom validation function, this should return an object contains errorMsg and isValid property
        isValidFunc: PropTypes.func,
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
        maxLength: PropTypes.number,
        // error msg display type, either 'popover', 'text', 'none'
        errorDisplayType: PropTypes.string
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
        maxLength: 50,
        errorDisplayType: 'none',
    }

    onBlur(e) {
        var nextState = { 
            ...this.state, 
            ...this.isValid(e.target.value),
            value: e.target.value, 
        };

        if (this.props.onBlur) {
            this.props.onBlur(e, nextState);
        }
        this.setState(nextState);
    }

    onFocus(e) {
        var nextState = { 
            ...this.state, 
            isValid: true,
            value: e.target.value, 
        };
        if (this.props.onFocus)  
            this.props.onFocus(e, this.state); 
        this.setState(nextState);
    }

    onChange(e) {
        var nextState = { 
            ...this.state, 
            value: e.target.value
        };

        if (this.props.onChange) 
            this.props.onChange(e, this.state);
        this.setState(nextState);  
    }

    isValid (val) {
        var { type, allowEmpty, maxLength, minLength, isValidFunc } = this.props,
            value = val || this.state.value;

        if (!allowEmpty)
            if(isEmpty(value)) {
                return { isValid: false, errorMsg: 'Required field' };
            }
    
        if (value.length > maxLength) {
            return { isValid: false, errorMsg: `Max input characters are ${maxLength}` };
        }

        if (value.length < minLength) {
            return { isValid: false, errorMsg: `You need at least ${minLength} characters` };
        }

        switch (type) {
            case 'email':
                if (!isEmailValid(value)) {
                    return { isValid: false, errorMsg: 'Email is not valid' };
                }
                break;
            case 'number':
                if (isNaN(parseInt(value))) {
                    return { isValid: false, errorMsg: 'Number is not valid' };
                }
                break;
        }

        if (isValidFunc)
            return isValidFunc(value);

        return { 
            isValid: true, 
            errorMsg: null
        };
    }

    getErrorDisplay(errorMsg) {
        switch (this.props.errorDisplayType) {
            case 'popover': 
                return <div className='error-hint-box'>{ errorMsg }</div>;
            case 'text':
                return <div style={ { color: '#86181d' } }>{ errorMsg }</div>;
            case 'none':
            default:
                return null;
        }
    }

    getErrorDisplayStyle(errorMsg) {
        if (!errorMsg)
            return null;
        switch (this.props.errorDisplayType) {
            case 'popover': 
                return { height: '62px' };
            case 'text':
                return { height: '42px' };
            case 'none':
            default:
                return null;
        }
    }

    render() {
        var { type, 
              name, 
              id, 
              value: valProps, 
              placeholder, 
              onBlur, 
              onChange, 
              allowEmpty, 
              className, 
              label,
              minLength, 
              maxLength } = this.props,
            { value: valState, isValid, errorMsg } = this.state;
        return (
            <div className='form-group' style={ isValid ? null : this.getErrorDisplayStyle(errorMsg) }>
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
                       value={ valProps == null ? valState : valProps }/>
                { isValid ? null : this.getErrorDisplay(errorMsg) }
            </div>
        );
    }
}

export default AppInput;