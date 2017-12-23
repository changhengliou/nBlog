import * as React from 'react';
import PropTypes from 'prop-types';

class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context);

        let { staticContext } = this.context.router;
        if (staticContext) {
            staticContext.statusCode = 404;
        }
    }

    static contextTypes = {
        router: PropTypes.object
    }

    render() {
        return (
            <div>
                <h2>Oops! Page not found.</h2>
            </div>
        );
    }
}

export default NotFound;
