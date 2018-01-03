import * as React from 'react';
import PropTypes from 'prop-types';

class PageLoadBar extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        progress: 50
    }

    static propTypes = {
        progress: PropTypes.number.isRequired
    }
    
    render() {
        return this.props.progress >= 100 ? null :
        (
            <div className="pace pace-active">
                <div className="pace-progress"  
                     style={ {transform: `translate3d(${this.props.progress}%, 0px, 0px)`} }>
                    <div className="pace-progress-inner"></div>
                </div>
                <div className={ this.props.progress >= 0 ? "pace-activity" : null }></div>
            </div>
        );
    }
}

export default PageLoadBar;