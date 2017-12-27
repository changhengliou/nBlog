import * as React from 'react';
import PropTypes from 'prop-types';

const arr = () => 
    <div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
            (i) => <div key={i} className={`sk-circle${i} sk-child`}/>
        )}
    </div>
;
class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        show: true
    }

    static propTypes = {
        show: PropTypes.bool
    }
    
    render() {
        return this.props.show ? (
            <div className="sk-circle">
                { arr() }
            </div>
        ) : null;
    }
}

export default Spinner;